import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid'

function UnderConstruction({ pageName }) {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>{pageName}</h1>
      </header>
      <div className="page-content">
        <div className="construction-container">
          <WrenchScrewdriverIcon className="construction-icon" />
          <h2>Página en Construcción</h2>
          <p>Estamos trabajando para brindarte la mejor experiencia.</p>
        </div>
      </div>
    </div>
  )
}

export default UnderConstruction 