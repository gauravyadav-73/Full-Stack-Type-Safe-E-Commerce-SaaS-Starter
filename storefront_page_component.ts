import { db } from "@/db";
import { products, type Product } from "@/db/schema";
import { createCheckoutSession } from "@/actions/checkout";

// Strongly-typed sub-component consuming DB models directly
function ProductCard({ product }: { product: Product }) {
  const handleCheckout = createCheckoutSession.bind(null, {
    productId: product.id,
    stripePriceId: product.stripePriceId,
  });

  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
      <p className="text-gray-600 mt-2 text-sm">{product.description ?? "No description provided."}</p>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-bold text-lg text-gray-900">
          ${(product.priceInCents / 100).toFixed(2)}
        </span>
        <form action={handleCheckout}>
          <button
            type="submit"
            className="bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Buy Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function HomePage() {
  // Query results are automatically typed as Product[]
  const productList: Product[] = await db.select().from(products);

  return (
    <main className="max-w-6xl mx-auto py-12 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">Type-Safe Storefront</h1>
        <p className="text-gray-500 mt-2">
          End-to-end type safety with Next.js, Drizzle, Zod, and Stripe.
        </p>
      </header>

      {productList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No products found in the database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}