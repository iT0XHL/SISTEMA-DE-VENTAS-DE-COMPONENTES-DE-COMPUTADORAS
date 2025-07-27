/*export default function Loading() {
  return null
}*/
export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-blue-600">Cargando productos...</span>
    </div>
  )
}
