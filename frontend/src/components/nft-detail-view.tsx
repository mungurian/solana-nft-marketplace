type NftDetailViewProps = {
  imageUrl?: string;
  imageAlt?: string;
  name?: string;
  description?: string;
  seller?: string;
  mint?: string;
  price?: string;
  buyLabel?: string;
  isBuyDisabled?: boolean;
  isOwner?: boolean;
  onBuy?: () => void;
  delistLabel?: string;
  isDelistDisabled?: boolean;
  onDelist?: () => void;
};

export function NftDetailView({
  imageUrl,
  imageAlt,
  name,
  description,
  seller,
  mint,
  price,
  buyLabel,
  isBuyDisabled,
  isOwner,
  onBuy,
  delistLabel,
  isDelistDisabled,
  onDelist,
}: NftDetailViewProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 sm:w-80">
        {isOwner && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-50 backdrop-blur-sm dark:bg-zinc-50/90 dark:text-zinc-900">
            Listed by you
          </span>
        )}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt ?? ""}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="skeleton h-full w-full" />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        {name ? (
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{name}</h1>
        ) : (
          <div className="skeleton h-7 w-2/3 rounded-md" />
        )}

        {name ? (
          description && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
          )
        ) : (
          <div className="skeleton mt-2 h-4 w-full rounded-md" />
        )}

        {seller && mint ? (
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Seller</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{seller}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">Mint</dt>
              <dd className="text-zinc-900 dark:text-zinc-50">{mint}</dd>
            </div>
          </dl>
        ) : (
          <div className="mt-4 space-y-1.5">
            <div className="skeleton h-5 w-full rounded-md" />
            <div className="skeleton h-5 w-full rounded-md" />
          </div>
        )}

        {price ? (
          <p className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{price}</p>
        ) : (
          <div className="skeleton mt-4 h-9 w-1/3 rounded-md" />
        )}

        {isOwner ? (
          <button
            type="button"
            disabled={isDelistDisabled || !onDelist}
            onClick={onDelist}
            className="mt-6 w-full rounded-full border border-red-600 px-6 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-zinc-950 sm:w-auto"
          >
            {delistLabel ?? "Delist"}
          </button>
        ) : (
          <button
            type="button"
            disabled={isBuyDisabled || !onBuy}
            onClick={onBuy}
            className="mt-6 w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            {buyLabel ?? "Buy — coming soon"}
          </button>
        )}
      </div>
    </div>
  );
}
