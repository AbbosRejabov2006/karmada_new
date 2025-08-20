export default function CartLoading() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md mx-auto mb-8"></div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-lg"></div>
            ))}
          </div>
          <div>
            <div className="h-80 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
