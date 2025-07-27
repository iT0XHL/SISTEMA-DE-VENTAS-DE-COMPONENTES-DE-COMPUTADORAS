import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MessageCircle, MapPin } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const socialLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/51923826161",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      description: "Soporte técnico y ventas",
    },
    {
      name: "Instagram",
      icon: "📷",
      url: "https://instagram.com/PCDos2_Peru",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
      description: "Productos y novedades",
    },
    {
      name: "Facebook",
      icon: "📘",
      url: "https://facebook.com/PCDos2_Peru",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
      description: "Comunidad y ofertas",
    },
    {
      name: "TikTok",
      icon: "🎵",
      url: "https://tiktok.com/@PCDos2_Peru",
      color: "text-white",
      bgColor: "bg-gradient-to-br from-gray-800 to-black hover:from-gray-900 hover:to-gray-800",
      description: "Reviews y tutoriales",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center animate-fade-in-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 animate-gradient-x">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte con tus consultas sobre componentes de PC
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <MessageCircle className="h-6 w-6 mr-3 text-green-600" />
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Contacto Principal
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                  <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl transform hover:scale-105 transition-all duration-300 border-2 border-green-100">
                    <div className="bg-green-500 p-4 rounded-full animate-pulse shadow-lg">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">WhatsApp</p>
                      <p className="text-green-600 font-bold text-2xl">+51 923-826-161</p>
                      <p className="text-sm text-gray-600 mt-1">Soporte técnico, ventas y consultas</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <div className="bg-blue-500 p-3 rounded-full animate-pulse animation-delay-500">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Dirección</p>
                      <p className="text-blue-600 font-bold">Av. Javier Prado Este 1234</p>
                      <p className="text-blue-600">San Isidro, Lima 15036</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 animate-fade-in-up animation-delay-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Clock className="h-6 w-6 mr-3 text-purple-600" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Horarios de Atención
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <span className="font-medium text-gray-800">Lunes - Viernes:</span>
                    <span className="font-bold text-blue-600">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <span className="font-medium text-gray-800">Sábados:</span>
                    <span className="font-bold text-green-600">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                    <span className="font-medium text-gray-800">Domingos:</span>
                    <span className="font-bold text-purple-600">9:00 AM - 3:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-pink-50 animate-fade-in-up animation-delay-500">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Síguenos en Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg ${social.bgColor} ${social.color} animate-fade-in-up`}
                      style={{ animationDelay: `${600 + index * 200}ms` }}
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="flex-shrink-0">
                          {social.name === "WhatsApp" ? (
                            <MessageCircle className="h-10 w-10 animate-bounce-subtle" />
                          ) : typeof social.icon === "string" ? (
                            <div className="text-4xl animate-float">{social.icon}</div>
                          ) : (
                            <social.icon className="h-10 w-10 animate-bounce-subtle" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">{social.name}</p>
                          <p className="text-sm opacity-90">{social.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Form */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 animate-fade-in-up animation-delay-700">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Contacto Rápido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-100">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                      ¿Tienes una consulta técnica?
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Nuestros expertos están listos para ayudarte a elegir los componentes perfectos para tu PC.
                    </p>
                    <Link
                      href="https://wa.me/51923826161?text=Hola,%20necesito%20ayuda%20con%20componentes%20de%20PC"
                      target="_blank"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Consultar por WhatsApp
                      </Button>
                    </Link>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                    <h4 className="font-semibold text-gray-800 mb-2">¿Necesitas una cotización?</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Envíanos tu lista de componentes por WhatsApp y te daremos el mejor precio del mercado.
                    </p>
                    <Link
                      href="https://wa.me/51923826161?text=Hola,%20necesito%20una%20cotización%20para%20los%20siguientes%20productos:"
                      target="_blank"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 bg-transparent"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Solicitar Cotización
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 mb-12 animate-fade-in-up animation-delay-900">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Preguntas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "¿Hacen instalación de componentes?",
                  answer:
                    "Sí, ofrecemos servicio de instalación y configuración de componentes. Consulta por WhatsApp para más información.",
                  gradient: "from-blue-50 to-white",
                  textColor: "text-blue-700",
                },
                {
                  question: "¿Tienen garantía los productos?",
                  answer:
                    "Todos nuestros productos cuentan con garantía oficial del fabricante, desde 12 meses hasta 3 años.",
                  gradient: "from-green-50 to-white",
                  textColor: "text-green-700",
                },
                {
                  question: "¿Realizan envíos a provincias?",
                  answer: "Sí, realizamos envíos a todo el Perú a través de empresas de courier confiables.",
                  gradient: "from-purple-50 to-white",
                  textColor: "text-purple-700",
                },
                {
                  question: "¿Aceptan todos los métodos de pago?",
                  answer:
                    "Aceptamos efectivo, tarjetas de crédito/débito, transferencias bancarias y billeteras digitales.",
                  gradient: "from-pink-50 to-white",
                  textColor: "text-pink-700",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`p-6 bg-gradient-to-br ${faq.gradient} rounded-xl shadow-sm transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-fade-in-up`}
                  style={{ animationDelay: `${1000 + index * 200}ms` }}
                >
                  <h4 className={`font-bold mb-3 ${faq.textColor} text-lg`}>{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up animation-delay-1200">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-3xl font-bold mb-4">¿Necesitas asesoría personalizada?</h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Nuestros expertos están listos para ayudarte a elegir los mejores componentes para tu PC
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://wa.me/51923826161?text=Hola,%20necesito%20asesoría%20personalizada%20para%20armar%20mi%20PC"
                target="_blank"
              >
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-300 animate-bounce-subtle"
                >
                  <MessageCircle className="h-6 w-6 mr-3" />
                  Chatear por WhatsApp
                </Button>
              </Link>
              <Link href="https://instagram.com/PCDos2_Peru" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-2 border-white hover:bg-white hover:text-blue-600 bg-transparent font-semibold px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl mr-3">📷</span>
                  Síguenos en Instagram
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
