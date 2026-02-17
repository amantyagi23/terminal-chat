import { adminPermissionSchema } from "./adminPermissionSchema";
import { adminSchema } from "./adminSchema";
import { adminSessionSchema } from "./adminSessionSchema";
import { blogSchema } from "./blogSchema";
import { bookingItemSchema } from "./bookingItemSchema";
import { bookingSchema } from "./bookingSchema";
import { cartSchema } from "./cartSchema";
import { categorySchema } from "./categorySchema";
import { citySchema } from "./citySchema";
import { countrySchema } from "./countrySchema";
import { couponSchema } from "./couponSchema";
import { destinationSchema } from "./destinationSchema";
import { faqSchema } from "./faqSchema";
import { forgotPasswordSchema } from "./forgotPasswordSchema";
import { moduleSchema } from "./moduleSchema";
import { otpSchema } from "./otpSchema";
import { permissionSchema } from "./permissionSchema";
import { productOptionSchema } from "./productOptionSchema";
import { productSchema } from "./productSchema";
import { StaticPagesSchema } from "./staticPageSchema";
import { supplierSchema } from "./supplierSchema";
import { supplierSessionSchema } from "./supplierSessionSchema";
import { userSchema } from "./userSchema";
import { userSessionSchema } from "./userSessionSchema";

export const schema = {
  adminSchema: adminSchema,
  adminSessionSchema: adminSessionSchema,
  moduleSchema: moduleSchema,
  permissionSchema: permissionSchema,
  adminPermissionSchema: adminPermissionSchema,
  forgotPasswordSchema: forgotPasswordSchema,
  destinationSchema: destinationSchema,
  categorySchema: categorySchema,
  productSchema: productSchema,
  productOptionSchema: productOptionSchema,
  supplierSchema: supplierSchema,
  userSessionSchema: userSessionSchema,
  userSchema: userSchema,
  countrySchema: countrySchema,
  citySchema: citySchema,
  otpSchema: otpSchema,
  supplierSessionSchema: supplierSessionSchema,
  faqSchema: faqSchema,
  cartSchema: cartSchema,
  bookingItemSchema: bookingItemSchema,
  bookingSchema: bookingSchema,
  couponSchema: couponSchema,
  StaticPagesSchema: StaticPagesSchema,
  blogSchema: blogSchema,
};
