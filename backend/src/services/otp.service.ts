import crypto from "node:crypto";

function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}


