"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Cpu, HardDrive, Zap, MessageCircle, MapPin } from "lucide-react"

export default function HomePage() {
  const categories = [
    {
      name: "Procesadores",
      icon: Cpu,
      description: "CPUs Intel y AMD de última generación",
      href: "/catalog?category=cat-1",
      gradient: "from-blue-500 via-purple-500 to-indigo-600",
      bgGradient: "from-blue-50 via-purple-50 to-indigo-100",
      hoverGradient: "from-blue-600 via-purple-600 to-indigo-700",
    },
    {
      name: "Tarjetas Gráficas",
      icon: Monitor,
      description: "GPUs NVIDIA y AMD para gaming y trabajo",
      href: "/catalog?category=cat-2",
      gradient: "from-green-500 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50 via-emerald-50 to-teal-100",
      hoverGradient: "from-green-600 via-emerald-600 to-teal-700",
    },
    {
      name: "Almacenamiento",
      icon: HardDrive,
      description: "SSDs, HDDs y almacenamiento NVMe",
      href: "/catalog?category=cat-4",
      gradient: "from-purple-500 via-pink-500 to-rose-600",
      bgGradient: "from-purple-50 via-pink-50 to-rose-100",
      hoverGradient: "from-purple-600 via-pink-600 to-rose-700",
    },
    {
      name: "Fuentes de Poder",
      icon: Zap,
      description: "PSUs certificadas y eficientes",
      href: "/catalog?category=cat-6",
      gradient: "from-orange-500 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50 via-amber-50 to-yellow-100",
      hoverGradient: "from-orange-600 via-amber-600 to-yellow-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-green-600 text-white py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up">
            Componentes de PC
            <span className="block bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent animate-gradient-x">
              de Alta Calidad
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-4xl mx-auto text-blue-100 leading-relaxed animate-fade-in-up animation-delay-500">
            Encuentra los mejores componentes para armar tu PC ideal. Procesadores, tarjetas gráficas, memoria RAM y
            más.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-1000">
            <Link href="/catalog">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-bounce-subtle"
              >
                Ver Productos
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-2 border-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
<section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-6">
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
          Categorías Principales
        </span>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Explora nuestras categorías de productos más populares
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((category, index) => {
        const Icon = category.icon
        return (
          <div
            key={category.name}
            className={`group hover:shadow-2xl transition-all duration-500 cursor-default h-full transform hover:scale-105 hover:-translate-y-2 border-0 bg-gradient-to-br ${category.bgGradient} shadow-lg animate-fade-in-up hover:animate-pulse-gentle`}
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <CardHeader className="text-center pb-4">
              <div
                className={`bg-gradient-to-r ${category.gradient} group-hover:bg-gradient-to-r group-hover:${category.hoverGradient} p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 animate-float`}
              >
                <Icon className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {category.description}
              </p>
            </CardContent>
          </div>
        )
      })}
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-green-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                ¿Por qué elegir PCDos2?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[{
              icon: Monitor,
              title: "Productos Originales",
              description: "Todos nuestros productos son originales y cuentan con garantía oficial",
              gradient: "from-blue-500 via-purple-500 to-indigo-600",
                bgGradient: "from-blue-50 to-purple-100",
              },
              {
                icon: Zap,
                title: "Entrega Rápida",
                description: "Entrega rápida y segura en Lima y provincias con seguimiento",
                gradient: "from-green-500 via-emerald-500 to-teal-600",
                bgGradient: "from-green-50 to-emerald-100",
              },
              {
                icon: HardDrive,
                title: "Soporte Técnico",
                description: "Asesoría especializada para ayudarte a elegir los mejores componentes",
                gradient: "from-purple-500 via-pink-500 to-rose-600",
                bgGradient: "from-purple-50 to-pink-100",
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className={`text-center group animate-fade-in-up bg-gradient-to-br ${feature.bgGradient} p-8 rounded-2xl hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2`}
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  <div
                    className={`bg-gradient-to-br ${feature.gradient} rounded-full p-6 w-24 h-24 mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6 animate-float`}
                  >
                    <Icon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-green-600 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 animate-gradient-x"></div>
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-6">¿Necesitas ayuda?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">Contáctanos por cualquiera de nuestros canales</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp",
                description: "Chatea con nosotros en tiempo real",
                link: "https://wa.me/51923826161",
                buttonText: "+51 923-826-161",
                gradient: "from-green-400 to-green-600",
                textColor: "text-green-600",
              },
              {
                icon: MapPin,
                title: "Tienda Física",
                description: "Visítanos en San Isidro, Lima",
                link: "/contact",
                buttonText: "Ver Dirección",
                gradient: "from-purple-400 to-purple-600",
                textColor: "text-purple-600",
              },
            ].map((contact, index) => {
              const Icon = contact.icon
              return (
                <div
                  key={contact.title}
                  className={`text-center group animate-fade-in-up`}
                  style={{ animationDelay: `${index * 300}ms` }}
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 hover:bg-white/30">
                    <div
                      className={`bg-gradient-to-br ${contact.gradient} rounded-full p-6 w-20 h-20 mx-auto mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-float`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{contact.title}</h3>
                    <p className="text-blue-100 mb-6">{contact.description}</p>
                    <Link href={contact.link} target={contact.link.startsWith("http") ? "_blank" : undefined}>
                      <Button
                        className={`bg-white ${contact.textColor} hover:bg-gray-100 font-semibold px-6 py-3 shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl animate-bounce-subtle`}
                      >
                        {contact.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
