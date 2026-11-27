/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

type Category = 'tratamiento' | 'producto';
type FilterOption = 'todos' | Category;

interface CatalogItem {
  id: string;
  name: string;
  category: Category;
  meta: string;
  description: string;
  price: number;
  image: string;
  alt: string;
}

interface CartEntry {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReviewItem {
  id: string;
  author: string;
  service: string;
  quote: string;
  rating: number;
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/TU_ID_FORMSPREE';
const STORAGE_KEY = 'depiviano_selection_v1';

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'depilacion-laser',
    name: 'Depilación Definitiva Láser',
    category: 'tratamiento',
    meta: 'Tratamiento · 45 min',
    description:
      'Tecnología láser de diodo con cabezal refrigerado para todo tipo de piel. Resultados progresivos y duraderos desde la primera sesión.',
    price: 18500,
    image: '/src/assets/images/hero_laser_depilation_1795795376996.jpg',
    alt: 'Sesión de depilación definitiva láser en gabinete DepiViano',
  },
  {
    id: 'hifu-facial',
    name: 'HIFU Tensor Facial',
    category: 'tratamiento',
    meta: 'Tratamiento · 60 min',
    description:
      'Ultrasonido focalizado de alta intensidad que estimula la producción natural de colágeno para tensar el óvalo facial sin cirugía.',
    price: 42000,
    image: '/src/assets/images/treatment_hifu_facial_1795795378832.jpg',
    alt: 'Especialista aplicando tratamiento facial HIFU en DepiViano',
  },
  {
    id: 'liposonix-corporal',
    name: 'Liposonix Corporal',
    category: 'tratamiento',
    meta: 'Tratamiento · 60 min',
    description:
      'Ultrasonido focalizado de acción profunda para reducir adiposidad localizada y modelar abdomen, flancos y muslos en pocas sesiones.',
    price: 38000,
    image: '/src/assets/images/treatment_liposonix_body_1795795378571.jpg',
    alt: 'Equipamiento Liposonix para modelado corporal en gabinete estético',
  },
  {
    id: 'limpieza-facial',
    name: 'Limpieza Facial Profunda',
    category: 'tratamiento',
    meta: 'Tratamiento · 50 min',
    description:
      'Protocolo completo con higiene, exfoliación controlada, extracción suave y activos botánicos hidratantes para restaurar luminosidad.',
    price: 22000,
    image: '/src/assets/images/treatment_facial_cleansing_1795795379465.jpg',
    alt: 'Limpieza facial profunda con activos hidratantes en DepiViano',
  },
  {
    id: 'gel-neutro-5l',
    name: 'Gel Neutro "DepiViano" 5 Lts',
    category: 'producto',
    meta: 'Insumo Profesional · Bidón 5 Lts',
    description:
      'Gel conductor cristalino, hipoalergénico, sin fragancias ni alcohol. Formulado especialmente para depilación láser, HIFU y aparatología.',
    price: 14900,
    image: '/src/assets/images/product_gel_neutro_1795795379635.jpg',
    alt: 'Gel Neutro DepiViano transparente de alta conductividad para estética',
  },
  {
    id: 'gel-neutro-1l',
    name: 'Gel Neutro "DepiViano" 1 Lt',
    category: 'producto',
    meta: 'Insumo Profesional · Envase Dosificador',
    description:
      'Presentación práctica con válvula dosificadora. Alta transparencia óptica, deslizamiento uniforme y fácil limpieza sin residuos.',
    price: 4800,
    image: '/src/assets/images/product_gel_neutro_1795795379635.jpg',
    alt: 'Envase dosificador de Gel Neutro DepiViano de un litro',
  },
];

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Anastasia Pupello',
    service: 'Depilación Definitiva Láser · 4 sesiones',
    quote:
      'Empecé hace cuatro meses y la reducción del vello fue notable desde la segunda cita. Cero molestias y puntualidad total en Emilio Mitre, además no me pidieron DNI y no vieron mi edad, que es un plus super importante',
    rating: 5,
  },
  {
    id: 'rev-2',
    author: 'Maricarmen Ponce',
    service: 'Gel Neutro DepiViano · Uso en gabinete',
    quote:
      'Compro los bidones de Gel Neutro DepiViano fabricados y controlados por Pomelito para mi consultorio. Tiene densidad justa, no mancha las prendas y protege los cabezales. Siempre uso buen gel porque mis clientes tienen plata, tienen plata Lili!!!!!',
    rating: 5,
  },
  {
    id: 'rev-3',
    author: 'Monica Hace Caca Penny',
    service: 'HIFU Facial & Limpieza Profunda',
    quote:
      'Combiné HIFU en la cintura y papada, noté el contorno mucho más firme y la piel luminosa durante semanas, sigo teniendo una teta que apunta a cualquier lado, proximamente lo repararemos Atención cálida y profesional.',
    rating: 5,
  },
  {
    id: 'rev-4',
    author: 'Carlos Nueve',
    service: 'Liposonix Corporal · Abdomen',
    quote:
      'Me explicaron cada etapa antes de empezar. A las tres semanas de la sesión ya veía cambios reales en la zona abdominal, por tal motivo yo deduci que Heditch era una excelente profesional',
    rating: 5,
  },
];

function formatARS(value: number): string {
  return `$${value.toLocaleString('es-AR')}`;
}

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}

function ResilientImage({ src, alt, className = '', fallbackTitle }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#fce6ed] via-[#f8d6e2] to-[#f4c4d5] p-6 text-center text-[#684955] ${className}`}
      >
        <Sparkles className="mb-2 h-6 w-6 text-[#9f2b56]" aria-hidden="true" />
        <span className="font-display text-base font-semibold text-[#2d1b22]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartEntry[]) : [];
    } catch {
      return [];
    }
  });

  // Contact form state
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [formState, setFormState] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  const filteredItems =
    activeFilter === 'todos'
      ? CATALOG_ITEMS
      : CATALOG_ITEMS.filter((item) => item.category === activeFilter);

  const totalQuantity = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalAmount = cart.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);

  function addToCart(item: CatalogItem) {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((entry) =>
          entry.id === id ? { ...entry, quantity: entry.quantity + delta } : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  }

  function clearCart() {
    setCart([]);
  }

  function loadSelectionIntoContact() {
    if (cart.length === 0) return;
    const summary = cart
      .map(
        (entry) =>
          `- ${entry.name} x${entry.quantity} (${formatARS(entry.price * entry.quantity)})`,
      )
      .join('\n');
    setMensaje(
      `Hola DepiViano, me gustaría consultar por:\n${summary}\nTotal estimado: ${formatARS(totalAmount)}`,
    );
    setCartOpen(false);
    const contactEl = document.getElementById('contacto');
    contactEl?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = nombre.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = mensaje.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFormState({
        status: 'error',
        message: 'Por favor completá tu nombre, correo electrónico y mensaje.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormState({
        status: 'error',
        message: 'Ingresá un correo electrónico válido para poder responderte.',
      });
      return;
    }

    if (FORMSPREE_ENDPOINT.includes('TU_ID_FORMSPREE')) {
      setFormState({
        status: 'error',
        message:
          'Formulario listo para Formspree: reemplazá TU_ID_FORMSPREE en src/App.tsx por tu ID real de Formspree, o llamanos al 6252-7514.',
      });
      return;
    }

    setFormState({ status: 'submitting', message: 'Enviando tu consulta...' });

    try {
      const formData = new FormData();
      formData.append('nombre', trimmedName);
      formData.append('email', trimmedEmail);
      formData.append('mensaje', trimmedMessage);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setFormState({
          status: 'success',
          message: 'Tu mensaje fue enviado correctamente. Te responderemos a la brevedad.',
        });
        setNombre('');
        setEmail('');
        setMensaje('');
      } else {
        setFormState({
          status: 'error',
          message: 'No pudimos enviar el mensaje en este momento. Intentá nuevamente.',
        });
      }
    } catch {
      setFormState({
        status: 'error',
        message: 'Error de conexión. También podés comunicarte al 6252-7514.',
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER SEMÁNTICO (Contrato de 3 zonas: Marca — Lista de navegación — Acción principal) */}
      <header className="site-header">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-6 py-3.5">
          <a
            href="#inicio"
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2d1b22] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#9f2b56] focus-visible:outline-offset-4"
          >
            Depi<span className="text-[#9f2b56]">Viano</span>
          </a>

          <nav className="hidden md:block" aria-label="Navegación principal">
            <ul className="nav-list">
              <li>
                <a href="#inicio" className="nav-link">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#productos" className="nav-link">
                  Productos
                </a>
              </li>
              <li>
                <a href="#ubicacion" className="nav-link">
                  Ubicación
                </a>
              </li>
              <li>
                <a href="#resenas" className="nav-link">
                  Reseñas
                </a>
              </li>
              <li>
                <a href="#contacto" className="nav-link">
                  Contacto
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir mi selección con ${totalQuantity} artículos`}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#9f2b56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7f1e42] focus-visible:outline-2 focus-visible:outline-[#9f2b56] focus-visible:outline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>Mi Selección</span>
              <span className="tabular-nums font-semibold">({totalQuantity})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#f0cdd8] bg-[#fff9fb] text-[#2d1b22] md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
          <nav
            aria-label="Navegación móvil"
            className="border-t border-[#f0cdd8] bg-[#fdf2f5] px-6 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-3 list-none m-0 p-0">
              {[
                { href: '#inicio', label: 'Inicio' },
                { href: '#productos', label: 'Productos' },
                { href: '#ubicacion', label: 'Ubicación' },
                { href: '#resenas', label: 'Reseñas' },
                { href: '#contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-base font-medium text-[#2d1b22] hover:text-[#9f2b56]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        {/* SECCIÓN 1: INICIO (HERO CON FONDO DE DEPILACIÓN DEFINITIVA LÁSER Y ROSADO PASTEL) */}
        <section id="inicio" className="hero-banner">
          <div className="mx-auto grid max-w-[1200px] items-stretch gap-8 px-6 py-12 lg:grid-cols-12 lg:py-16">
            <div className="border-b border-[#f0cdd8] pb-4 lg:col-span-12">
              <p className="font-display text-5xl font-bold tracking-tight text-[#2d1b22] sm:text-6xl lg:text-7xl">
                Depi<span className="text-[#9f2b56]">Viano</span>
              </p>
            </div>

            <div className="flex flex-col justify-center lg:col-span-7">
              <p className="mb-3 text-sm font-medium text-[#684955]">
                Emilio Mitre 75 4 B · Tel. 6252-7514
              </p>
              <h1 className="hero-headline font-display font-bold text-[#2d1b22]">
                Centro de estetica <span className="text-[#9f2b56]">DepiVIano</span>
              </h1>
              <p className="mt-4 max-w-[60ch] text-lg font-medium leading-relaxed text-[#4f343e] sm:text-xl">
                Gel producido artesanalmente por Pomelito
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#productos"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#9f2b56] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f1e42] whitespace-nowrap shrink-0"
                >
                  Explorar tratamientos y gel
                </a>
                <a
                  href="#contacto"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#d9a6b7] bg-[#fff9fb]/90 px-6 py-3 text-sm font-semibold text-[#2d1b22] transition-colors hover:border-[#9f2b56] hover:text-[#9f2b56] whitespace-nowrap shrink-0"
                >
                  Solicitar turno
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-[#f0cdd8] bg-[#fff9fb]">
                <ResilientImage
                  src="/src/assets/images/hero_laser_depilation_1795795376996.jpg"
                  alt="Tratamiento profesional de depilación definitiva láser en DepiViano"
                  fallbackTitle="Depilación Definitiva Láser"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2d1b22]/80 via-[#2d1b22]/35 to-transparent p-5 text-white">
                  <p className="text-xs font-medium text-[#fce6ed]">
                    Atención personalizada · Turnos de lunes a sábados
                  </p>
                  <p className="font-display text-lg font-semibold">
                    Tecnología láser segura para todo tipo de piel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: PRODUCTOS Y SERVICIOS (ORGANIZADA CON FLEXBOX RESPONSIVO) */}
        <section id="productos" className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#2d1b22] sm:text-4xl">
              Productos y Servicios
            </h2>
            <p className="mt-3 text-base text-[#684955]">
              Elegí entre nuestros tratamientos en gabinete o solicitá el Gel Neutro DepiViano
              en presentaciones profesionales.
            </p>
          </div>

          {/* Controles de filtro interactivos */}
          <div className="mb-10 flex justify-center">
            <div
              role="group"
              aria-label="Filtrar por categoría"
              className="inline-flex items-center gap-1 rounded-xl border border-[#f0cdd8] bg-[#fff9fb] p-1"
            >
              {(
                [
                  { key: 'todos', label: 'Todos' },
                  { key: 'tratamiento', label: 'Tratamientos' },
                  { key: 'producto', label: 'Gel Neutro' },
                ] as const
              ).map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`min-h-[40px] rounded-lg px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#9f2b56] text-white'
                        : 'text-[#684955] hover:text-[#2d1b22]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contenedor Flexbox requerido para Productos */}
          <div className="products-flex">
            {filteredItems.map((item) => (
              <article key={item.id} className="product-card">
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#fce6ed]">
                  <ResilientImage
                    src={item.image}
                    alt={item.alt}
                    fallbackTitle={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium text-[#684955]">{item.meta}</p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-[#2d1b22]">
                    {item.name}
                  </h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-[#684955]">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#f0cdd8] pt-4">
                    <span className="tabular-nums text-lg font-semibold text-[#2d1b22]">
                      {formatARS(item.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-[#9f2b56] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7f1e42] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN 3: MULTIMEDIA Y UBICACIÓN (IMAGEN DEL GABINETE + IFRAME MAPA) */}
        <section
          id="ubicacion"
          className="border-y border-[#f0cdd8] bg-[#fce6ed]/55 py-16 lg:py-20"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-[#2d1b22] sm:text-4xl">
                Nuestro Gabinete y Ubicación
              </h2>
              <p className="mt-3 text-base text-[#684955]">
                Te recibimos en <strong className="font-semibold text-[#2d1b22]">Emilio Mitre 75 4 B</strong>,
                en un espacio tranquilo y equipado para cada protocolo estético.
              </p>
            </div>

            <div className="grid items-stretch gap-8 lg:grid-cols-2">
              <div className="flex flex-col overflow-hidden rounded-2xl border border-[#f0cdd8] bg-[#fff9fb]">
                <div className="aspect-[16/9] w-full overflow-hidden bg-[#fce6ed]">
                  <ResilientImage
                    src="/src/assets/images/clinic_gabinete_interior_1795795379360.jpg"
                    alt="Interior del gabinete estético DepiViano en Emilio Mitre 75 4 B"
                    fallbackTitle="Gabinete DepiViano"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#2d1b22]">
                      Atención con turno previo
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#684955]">
                      Cada sesión incluye evaluación inicial de piel para ajustar parámetros de
                      depilación láser, HIFU o Liposonix de acuerdo a tus objetivos.
                    </p>
                  </div>
                  <p className="mt-4 text-sm font-medium text-[#9f2b56]">
                    Emilio Mitre 75, Piso 4 &quot;B&quot; · Tel. 6252-7514
                  </p>
                </div>
              </div>

              <div className="min-h-[340px] overflow-hidden rounded-2xl border border-[#f0cdd8] bg-[#fff9fb]">
                <iframe
                  title="Mapa de ubicación DepiViano en Emilio Mitre 75"
                  src="https://maps.google.com/maps?q=Emilio%20Mitre%2075,%20Buenos%20Aires&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="h-full min-h-[340px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: RESEÑAS (ORGANIZADA CON CSS GRID) */}
        <section id="resenas" className="mx-auto max-w-[1200px] px-6 py-16 lg:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#2d1b22] sm:text-4xl">
              Reseñas de Clientas
            </h2>
            <p className="mt-3 text-base text-[#684955]">
              Opiniones reales sobre nuestros tratamientos faciales, corporales y nuestro Gel
              Neutro DepiViano.
            </p>
          </div>

          <div className="reviews-grid">
            {REVIEWS.map((review) => (
              <article key={review.id} className="review-card">
                <div>
                  <p className="text-xs font-medium text-[#9f2b56]">{review.service}</p>
                  <p
                    className="mt-2 text-sm tracking-wide text-[#b46a20]"
                    aria-label={`${review.rating} de 5 estrellas`}
                  >
                    {'★'.repeat(review.rating)}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#4f343e]">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>
                <p className="mt-5 border-t border-[#f0cdd8] pt-3 text-sm font-semibold text-[#2d1b22]">
                  {review.author}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN 5: CONTACTO (FORMSPREE + MEDIA QUERIES) */}
        <section id="contacto" className="mx-auto max-w-[1200px] px-6 pb-20 pt-4">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#2d1b22] sm:text-4xl">
              Contacto y Pedidos
            </h2>
            <p className="mt-3 text-base text-[#684955]">
              Consultanos por turnos disponibles o hacé tu pedido de Gel Neutro DepiViano.
            </p>
          </div>

          <div className="contact-wrapper">
            <div className="flex flex-col justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#2d1b22]">
                  Datos del establecimiento
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#684955]">
                  Respondemos consultas sobre disponibilidad horaria, promociones en sesiones de
                  depilación láser y envíos mayoristas de gel conductor.
                </p>

                <dl className="mt-6 space-y-4 text-sm text-[#2d1b22]">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#9f2b56]" aria-hidden="true" />
                    <div>
                      <dt className="font-semibold">Dirección</dt>
                      <dd className="text-[#684955]">Emilio Mitre 75 4 B</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#9f2b56]" aria-hidden="true" />
                    <div>
                      <dt className="font-semibold">Teléfono</dt>
                      <dd>
                        <a
                          href="tel:62527514"
                          className="tabular-nums font-semibold text-[#9f2b56] hover:underline"
                        >
                          6252-7514
                        </a>
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>

              <div className="rounded-xl border border-[#f0cdd8] bg-[#fdf2f5] p-4 text-sm text-[#4f343e]">
                Horarios de atención: lunes a sábados de 09:00 a 20:00 hs con turno programado.
              </div>
            </div>

            <form
              action={FORMSPREE_ENDPOINT}
              method="POST"
              onSubmit={handleContactSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-sm font-medium text-[#2d1b22]">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: María Pérez"
                  className="min-h-[44px] rounded-lg border border-[#e7bccb] bg-white px-3.5 py-2.5 text-sm text-[#2d1b22] placeholder:text-[#9a7b87] focus:border-[#9f2b56] focus:outline-2 focus:outline-[#9f2b56]/25"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#2d1b22]">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="min-h-[44px] rounded-lg border border-[#e7bccb] bg-white px-3.5 py-2.5 text-sm text-[#2d1b22] placeholder:text-[#9a7b87] focus:border-[#9f2b56] focus:outline-2 focus:outline-[#9f2b56]/25"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="mensaje" className="text-sm font-medium text-[#2d1b22]">
                  Mensaje o pedido
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Contanos qué tratamiento o presentación de Gel Neutro DepiViano te interesa..."
                  className="rounded-lg border border-[#e7bccb] bg-white px-3.5 py-2.5 text-sm text-[#2d1b22] placeholder:text-[#9a7b87] focus:border-[#9f2b56] focus:outline-2 focus:outline-[#9f2b56]/25"
                />
              </div>

              <button
                type="submit"
                disabled={formState.status === 'submitting'}
                className="mt-1 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#9f2b56] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f1e42] disabled:opacity-60 cursor-pointer"
              >
                {formState.status === 'submitting' ? 'Enviando...' : 'Enviar mensaje'}
              </button>

              {formState.status !== 'idle' && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                    formState.status === 'success'
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : formState.status === 'error'
                        ? 'border-[#e4a6b8] bg-[#fdf2f5] text-[#7f1e42]'
                        : 'border-[#f0cdd8] bg-[#fdf2f5] text-[#2d1b22]'
                  }`}
                >
                  {formState.status === 'success' ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{formState.message}</span>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* PANEL LATERAL DE SELECCIÓN / CARRITO */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#2d1b22]/40 backdrop-blur-[2px]"
          onClick={() => setCartOpen(false)}
        >
          <aside
            aria-label="Tu selección de servicios y productos"
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-md flex-col border-l border-[#f0cdd8] bg-[#fff9fb] p-6"
          >
            <div className="flex items-center justify-between border-b border-[#f0cdd8] pb-4">
              <h2 className="font-display text-xl font-semibold text-[#2d1b22]">Tu Selección</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Cerrar panel de selección"
                className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-[#684955] hover:bg-[#fce6ed] hover:text-[#2d1b22] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5">
              {cart.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#684955]">
                  Todavía no agregaste tratamientos ni productos a tu selección.
                </p>
              ) : (
                <ul className="space-y-3 list-none m-0 p-0">
                  {cart.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#f0cdd8] bg-white p-3.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#2d1b22]">{entry.name}</p>
                        <p className="tabular-nums text-xs text-[#684955]">
                          {formatARS(entry.price)} c/u
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(entry.id, -1)}
                          aria-label={`Quitar una unidad de ${entry.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#f0cdd8] bg-[#fdf2f5] text-[#2d1b22] hover:bg-[#fce6ed] cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="tabular-nums w-5 text-center text-sm font-medium text-[#2d1b22]">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(entry.id, 1)}
                          aria-label={`Agregar una unidad de ${entry.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#f0cdd8] bg-[#fdf2f5] text-[#2d1b22] hover:bg-[#fce6ed] cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-[#f0cdd8] pt-4">
              <div className="mb-4 flex items-center justify-between text-base">
                <span className="text-[#684955]">Total estimado</span>
                <strong className="tabular-nums text-lg font-semibold text-[#2d1b22]">
                  {formatARS(totalAmount)}
                </strong>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={loadSelectionIntoContact}
                  className="min-h-[44px] w-full rounded-lg bg-[#9f2b56] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7f1e42] disabled:opacity-50 cursor-pointer"
                >
                  Cargar pedido en Contacto
                </button>
                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={clearCart}
                  className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-lg border border-[#f0cdd8] bg-white px-4 py-2 text-sm font-medium text-[#684955] hover:text-[#2d1b22] disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>Vaciar selección</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* FOOTER SEMÁNTICO */}
      <footer className="site-footer">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-lg font-bold text-[#2d1b22]">DepiViano</p>
            <p className="text-sm text-[#684955]">
              Emilio Mitre 75 4 B · Teléfono: 6252-7514
            </p>
          </div>
          <p className="text-xs text-[#684955]">
            &copy; 2026 DepiViano Estética &amp; Gel Neutro. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
