import { createFileRoute } from "@tanstack/react-router";
import { ProductsManager } from "#/components/seller/products-manager";

export const Route = createFileRoute("/_site/seller/products")({ component: () => <ProductsManager kind="product" /> });
