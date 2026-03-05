local otpKey = KEYS[1]
local reqKey = KEYS[2]
local cooldownKey = KEYS[3]
local blockKey = KEYS[4]

local otp = ARGV[1]

-- check block
if redis.call("EXISTS", blockKey) == 1 then
  return {err="BLOCKED"}
end

-- check cooldown
if redis.call("EXISTS", cooldownKey) == 1 then
  return {err="COOLDOWN"}
end

-- increment request count
local req = redis.call("INCR", reqKey)

if req == 1 then
  redis.call("EXPIRE", reqKey, 3600)
end

if req > 20 then
  return {err="RATE_LIMIT"}
end

-- store OTP
redis.call("SET", otpKey, otp, "EX", 30)

-- set resend cooldown
redis.call("SET", cooldownKey, "1", "EX", 15)

return {ok="OK"}