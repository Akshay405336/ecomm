import { prisma } from "@/infrastructure/database/prisma";
import { ProductImageType } from "@prisma/client";

import { CreateProductInput, UpdateProductInput } from "../types/product.types";

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export const productRepository = {
  // GET ALL PRODUCTS
  async findAll() {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return products.map((p) => ({
      ...p,
      originalPrice: Number(p.originalPrice),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
    }));
  },

  // FIND PRODUCT BY ID
  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      originalPrice: Number(product.originalPrice),
      discountPrice: product.discountPrice
        ? Number(product.discountPrice)
        : null,
    };
  },

  // FIND PRODUCT BY SLUG
  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true },
    });

    if (!product) return null;

    return {
      ...product,
      originalPrice: Number(product.originalPrice),
      discountPrice: product.discountPrice
        ? Number(product.discountPrice)
        : null,
    };
  },

  async findPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,

        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          images: {
            orderBy: { sortOrder: "asc" },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.product.count(),
    ]);

    return {
      products: products.map((p) => ({
        ...p,
        originalPrice: Number(p.originalPrice),
        discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      })),

      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  // CREATE PRODUCT
  async create(
    data: CreateProductInput,
    mainImage?: string,
    galleryImages?: string[],
  ) {
    const { slug, name, ...rest } = data;

    const safeSlug = slug ?? generateSlug(name);

    const existing = await prisma.product.findUnique({
      where: { slug: safeSlug },
    });

    if (existing) {
      throw new Error("Product with this slug already exists");
    }

    return prisma.product.create({
      data: {
        name,
        slug: safeSlug,
        ...rest,

        images: {
          create: [
            ...(mainImage
              ? [
                  {
                    url: mainImage,
                    type: ProductImageType.MAIN,
                    sortOrder: 0,
                  },
                ]
              : []),

            ...(galleryImages?.map((img, index) => ({
              url: img,
              type: ProductImageType.GALLERY,
              sortOrder: index + 1,
            })) ?? []),
          ],
        },
      },
      include: {
        images: true,
      },
    });
  },

  // UPDATE PRODUCT
  async update(
  id: string,
  data: UpdateProductInput,
  mainImage?: string | null,
  galleryImages?: string[],
) {

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const { slug, name, ...rest } = data;

  let safeSlug = slug;

  if (!slug && name) {
    safeSlug = generateSlug(name);
  }

  if (safeSlug) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: safeSlug,
        NOT: { id },
      },
    });

    if (existing) {
      throw new Error("Product slug already exists");
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...rest,
      ...(name !== undefined && { name }),
      ...(safeSlug !== undefined && { slug: safeSlug }),
    },
  });

  /*
    UPDATE MAIN IMAGE
  */
  if (mainImage !== undefined) {

    // remove old main image
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
        type: ProductImageType.MAIN,
      },
    });

    if (mainImage) {
      await prisma.productImage.create({
        data: {
          url: mainImage,
          type: ProductImageType.MAIN,
          sortOrder: 0,
          productId: id,
        },
      });
    }

  }

  /*
    ADD NEW GALLERY IMAGES (APPEND)
  */
  if (galleryImages && galleryImages.length > 0) {

    const existingGalleryCount = await prisma.productImage.count({
      where: {
        productId: id,
        type: ProductImageType.GALLERY,
      },
    });

    const newImages = galleryImages.map((img, index) => ({
      url: img,
      type: ProductImageType.GALLERY,
      sortOrder: existingGalleryCount + index + 1,
      productId: id,
    }));

    await prisma.productImage.createMany({
      data: newImages,
    });

  }

  return prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

},

  // DELETE PRODUCT
  async delete(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    await prisma.product.delete({
      where: { id },
    });
  },
};
