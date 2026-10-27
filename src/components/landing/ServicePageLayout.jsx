import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function ServicePageLayout({ title, image, description, points = [], gallery, image2, description2, mobileGallery, children }) {
  return (
    <main className="min-h-screen">
      <div className="relative h-72 md:h-96 overflow-hidden bg-navy">
        <img src={image} alt={title} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
            <h1
              className="text-3xl md:text-5xl font-bold text-white"
            >
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <a href="/#services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Обратно към всички настилки
        </a>

        {mobileGallery}

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div
            className="hidden lg:block"
          >
            <img src={image} alt={title} className="w-full rounded-lg shadow-lg object-cover h-80" />
            {gallery && gallery.length > 0 && children}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
            <div className="w-12 h-1 bg-primary mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-8">{description}</p>

            <h3 className="font-bold text-foreground mb-4">Предимства:</h3>
            <ul className="space-y-3 mb-10">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <a
              href="/#contact"
              className="inline-block bg-primary text-white px-8 py-3.5 font-semibold rounded hover:bg-primary/90 transition-all duration-200"
            >
              Заявете оферта
            </a>
          </div>
        </div>

        {image2 && description2 && (
          <div className="grid lg:grid-cols-2 gap-14 items-start mt-20">
            <div>
              <div className="w-12 h-1 bg-primary mb-6" />
              <p className="text-muted-foreground leading-relaxed">{description2}</p>
            </div>

            <div>
              <img src={image2} alt={title} className="w-full rounded-lg shadow-lg object-cover h-80" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
