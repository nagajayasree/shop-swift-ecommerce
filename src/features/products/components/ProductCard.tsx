import { ProductProps } from "../types";

export default function ProductCard({ id, title, price, brand, rating, category, thumbnail }: ProductProps) {
  return (
    <div className="w-full self-start rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100">
      <div className="relative w-full">
        <img
          src={thumbnail}
          alt={title}
          className="block w-full h-56 object-cover"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">{brand || 'No Brand'}</p>
        <h3 className="text-lg font-semibold text-gray-900 mt-1 truncate">{title}</h3>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm text-gray-700 ml-1">{rating}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
          </div>
          <button className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}