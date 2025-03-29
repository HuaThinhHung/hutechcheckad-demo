import { Pagination as MantinePagination } from '@mantine/core'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const Pagination = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalItems
}: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // add parameter "page" to url
  const [searchParams, setSearchParams] = useSearchParams()

  // thêm dữ liệu trang vào url search params
  useEffect(() => {
    setSearchParams({ page: currentPage.toString() })
  }, [currentPage])

  return (
    <>
      <MantinePagination
        total={totalPages}
        siblings={1}
        onChange={setCurrentPage}
        value={currentPage}
        // initialPage={currentPage}
        withEdges
      />
    </>
  )
}
