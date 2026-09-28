import Link from "next/link";

type ListingCardViewProps = {
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
  name?: string;
  seller?: string;
  price?: string;
  isOwner?: boolean;
};

const CARD_CLASSNAME =
  "block overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800";

export function ListingCardView({
  href,
  imageUrl,
  imageAlt,
  name,
  seller,
  price,
  isOwner,
}: ListingCardViewProps) {
  const body = (
    <>
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-900">
        {isOwner && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-50 backdrop-blur-sm dark:bg-zinc-50/90 dark:text-zinc-900">
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
      <div className="space-y-2.5 p-4">
        {name ? (
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {name}
          </p>
        ) : (
          <div className="skeleton h-5 w-3/4 rounded-md" />
        )}
        {seller ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Seller {seller}</p>
        ) : (
          <div className="skeleton h-3 w-1/2 rounded-md" />
        )}
        {price ? (
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{price}</p>
        ) : (
          <div className="skeleton h-7 w-1/3 rounded-md" />
        )}
      </div>
    </>
  );

  if (!href) {
    return <div className={CARD_CLASSNAME}>{body}</div>;
  }

  return (
    <Link
      href={href}
      className={`${CARD_CLASSNAME} cursor-pointer transition-colors hover:border-zinc-300 dark:hover:border-zinc-700`}
    >
      {body}
    </Link>
  );
}
