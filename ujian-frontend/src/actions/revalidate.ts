"use server";

import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";

export default async function revalidateAction(path: string) {
  revalidatePath(path);
}
