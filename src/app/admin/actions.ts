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

/**
 * Categories feed the products filters and the homepage tiles, so refresh both
 * after a category is created, renamed, or removed.
 */
export async function revalidateCategories() {
  revalidatePath("/");
  revalidatePath("/products");
}

/** Refresh the homepage after the hero is edited or toggled. */
export async function revalidateHome() {
  revalidatePath("/");
}
