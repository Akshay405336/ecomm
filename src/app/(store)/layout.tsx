import Header from "@/components/store/layouts/header"
import Footer from "@/components/store/layouts/footer"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}