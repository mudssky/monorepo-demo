import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
// 404 page
export function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-700">
      <div>
        <div className="text-4xl text-white">404</div>
        <Link to={'/'} className="text-white">
          {t('Back to home')}
        </Link>
      </div>
    </div>
  )
}
