export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 text-white"> {/* Añadido text-white aquí */}
      <h1 className="text-3xl font-bold mb-4">Acerca de Nosotros</h1>
      <p className="mb-4">
        Bienvenido a nuestra tienda. Nos especializamos en ofrecer productos de alta calidad
        para satisfacer las necesidades de nuestros clientes.
      </p>
      <p className="mb-4">
        Nuestra misión es brindar una experiencia de compra fácil y cómoda, asegurándonos de
        que nuestros productos sean accesibles para todos. Creemos en la transparencia, la
        confianza y el compromiso con nuestros clientes.
      </p>
      <p className="mb-4">
        Si tienes alguna pregunta o inquietud, no dudes en ponerte en contacto con nosotros.
      </p>
      
      <h2 className="text-2xl font-bold mb-2">Nuestro equipo</h2>
      <p className="mb-4">
        Contamos con un equipo apasionado y dedicado que trabaja arduamente para ofrecer los
        mejores productos y el mejor servicio. ¡Gracias por confiar en nosotros!
      </p>

      {/* Lista de integrantes */}
      <h3 className="text-xl font-bold mb-2">Integrantes</h3>
      <ul className="list-disc ml-6">
        <li>Backend: Martin Alvarés</li>
        <li>Frontend: Ignacio Oyarzún</li>
      </ul>
    </div>
  );
}
