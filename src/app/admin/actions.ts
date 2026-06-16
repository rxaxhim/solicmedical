"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidate the public catalogue pages after an admin change so edits show up
 * immediately instead of waiting for the next ISR window. Safe to call from
 * client components (it's a Server Action).
 */
export async function revalidateCatalogue(slug?: string) {
  revalidatePath("/products");
  if (slug) revalidatePath(`/products/${slug}`);
}
