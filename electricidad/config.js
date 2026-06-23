/* TechCam Hogar — datos de la landing de electricidad */
window.TC_CONFIG = {
  accent: "#FFD23F",
  accentInk: "#9A7611",
  wa: "5491178298512",
  servicio: "Electricidad",
  clienteId: "hogar-electricidad",
  waGeneric: "Hola TechCam Hogar 👋 Quiero un presupuesto de un trabajo eléctrico.",
  waQuizIntro: "Hola TechCam Hogar 👋 Quiero un presupuesto de un trabajo eléctrico.",
  fx: { streak: "255,210,63", dot: "255,228,138" },
  map: { center: [-34.62, -58.46], zoom: 9, radius: 24000 },
  steps: [
    { key: "trabajo", label: "Trabajo", q: "¿Qué necesitás resolver?", options: [
      { value: "Instalación nueva", label: "Instalación nueva", desc: "Casa o local desde cero" },
      { value: "Tablero / protecciones", label: "Tablero", desc: "Nuevo o a normalizar" },
      { value: "Reparación / falla", label: "Reparación", desc: "Cortes, chispazos, recalentamiento" },
      { value: "Urgencia por corte", label: "Urgencia por corte", desc: "Te quedaste sin luz" }
    ]},
    { key: "tamano", label: "Tamaño", q: "¿Qué tamaño tiene el trabajo?", options: [
      { value: "1 ambiente / pocas bocas", label: "1 ambiente", desc: "Arreglo puntual" },
      { value: "2 a 4 ambientes", label: "2 a 4 ambientes", desc: "Depto o PH" },
      { value: "Casa completa", label: "Casa completa", desc: "Instalación integral" },
      { value: "Local / comercio", label: "Local / comercio", desc: "Oficina o comercio" }
    ]},
    { key: "certificado", label: "Certificado", q: "¿Necesitás certificado de electricista matriculado?", options: [
      { value: "Sí, lo necesito", label: "Sí, lo necesito", desc: "Para trámite o habilitación" },
      { value: "No", label: "No", desc: "Solo el trabajo" },
      { value: "No estoy seguro", label: "No estoy seguro", desc: "Quiero que me asesoren" }
    ]},
    { key: "urgencia", label: "Urgencia", q: "¿Para cuándo lo necesitás?", options: [
      { value: "Hoy / urgente", label: "Hoy / urgente", desc: "Lo antes posible" },
      { value: "Esta semana", label: "Esta semana", desc: "En los próximos días" },
      { value: "Estoy cotizando", label: "Estoy cotizando", desc: "Comparando opciones" }
    ]}
  ],
  faqs: [
    { q: "¿El presupuesto tiene costo?", a: "No. El presupuesto es sin cargo y sin compromiso. Para instalaciones grandes o diagnósticos de falla podemos coordinar una visita técnica; te avisamos antes si tuviera algún costo." },
    { q: "¿Trabajan con electricista matriculado?", a: "Sí. Cuando el trabajo necesita certificado o plano firmado (habilitaciones, trámites, normalizaciones), lo gestionamos con un electricista matriculado. Si solo necesitás el arreglo, también lo hacemos sin trámite." },
    { q: "¿Responden si algo falla después del trabajo?", a: "Sí. Respondemos por la mano de obra de cada instalación y reparación: si algo de lo que hicimos no quedó bien, volvemos y lo resolvemos. Los materiales nuevos conservan la garantía del fabricante." },
    { q: "¿Atienden urgencias por corte de luz?", a: "Sí. Las urgencias (te quedaste sin luz, salta la térmica, olor a quemado) tienen prioridad e intentamos responder en el día. Escribinos por WhatsApp y te damos los primeros pasos." },
    { q: "¿Qué formas de pago aceptan?", a: "Efectivo, transferencia y los principales medios digitales. Según el trabajo podemos ofrecer pago en partes (seña + saldo al terminar). Lo charlamos al pasar el presupuesto." },
    { q: "¿Hacen normalización de instalaciones viejas?", a: "Sí. Revisamos instalaciones antiguas o improvisadas y las dejamos seguras: tablero con disyuntor y térmicas, puesta a tierra y cableado al día según la cantidad de bocas y consumo." }
  ]
};
