/* TechCam Hogar — datos de la landing de aire acondicionado */
window.TC_CONFIG = {
  accent: "#25E0D0",
  accentInk: "#0FB9AC",
  wa: "5491178298512",
  servicio: "Aire acondicionado",
  clienteId: "hogar-aire",
  waGeneric: "Hola TechCam Hogar 👋 Quiero un presupuesto de aire acondicionado.",
  waQuizIntro: "Hola TechCam Hogar 👋 Quiero un presupuesto de aire acondicionado.",
  fx: { streak: "37,224,208", dot: "160,232,226" },
  map: { center: [-34.62, -58.46], zoom: 9, radius: 24000 },
  steps: [
    { key: "tipo", label: "Equipo", q: "¿Qué tipo de equipo necesitás?", options: [
      { value: "Split frío/calor", label: "Split frío/calor", desc: "Un ambiente, frío y calor" },
      { value: "Multisplit", label: "Multisplit", desc: "Varios ambientes, una exterior" },
      { value: "A definir", label: "No estoy seguro", desc: "Quiero que me asesoren" }
    ]},
    { key: "tamano", label: "Tamaño", q: "¿Qué tenés que climatizar?", options: [
      { value: "1 ambiente (hasta 20 m²)", label: "1 ambiente", desc: "Hasta 20 m²" },
      { value: "2 a 3 ambientes", label: "2 a 3 ambientes", desc: "Depto o PH chico" },
      { value: "Casa / PH grande", label: "Casa grande", desc: "Varios ambientes" },
      { value: "Local comercial", label: "Local comercial", desc: "Oficina o comercio" }
    ]},
    { key: "trabajo", label: "Trabajo", q: "¿Qué necesitás resolver?", options: [
      { value: "Instalación nueva", label: "Instalación nueva", desc: "Equipo a estrenar" },
      { value: "Mantenimiento / carga de gas", label: "Mantenimiento", desc: "Limpieza o carga de gas" },
      { value: "Reparación (no enfría)", label: "Reparación", desc: "No enfría o hace ruido" },
      { value: "Mudanza de equipo", label: "Mudanza de equipo", desc: "Desinstalar y reinstalar" }
    ]},
    { key: "urgencia", label: "Urgencia", q: "¿Para cuándo lo necesitás?", options: [
      { value: "Hoy / urgente", label: "Hoy / urgente", desc: "Lo antes posible" },
      { value: "Esta semana", label: "Esta semana", desc: "En los próximos días" },
      { value: "Estoy cotizando", label: "Estoy cotizando", desc: "Comparando opciones" }
    ]}
  ],
  faqs: [
    { q: "¿El presupuesto tiene costo?", a: "No. El presupuesto es sin cargo y sin compromiso. Para instalaciones grandes o reparaciones puntuales podemos coordinar una visita técnica de diagnóstico; te avisamos antes si tuviera algún costo." },
    { q: "¿Responden si algo falla después del trabajo?", a: "Sí. Respondemos por la mano de obra de cada instalación y reparación: si algo de lo que hicimos no quedó bien, lo resolvemos. Además, los equipos nuevos conservan la garantía oficial del fabricante." },
    { q: "¿En cuánto tiempo pueden venir?", a: "En casos urgentes (no enfría con calor extremo) intentamos responder en el día. Para instalaciones programadas solemos coordinar la visita dentro de las 48 a 72 horas, según la zona y la agenda." },
    { q: "¿Qué formas de pago aceptan?", a: "Efectivo, transferencia y los principales medios digitales. Según el trabajo podemos ofrecer pago en partes (seña + saldo al terminar). Lo charlamos al pasar el presupuesto." },
    { q: "¿Instalan equipos que compré por mi cuenta?", a: "Sí. Instalamos equipos comprados por vos o podemos conseguirte el equipo. En ambos casos revisamos que el modelo sea adecuado para el ambiente antes de instalar." },
    { q: "¿Trabajan en departamentos en altura?", a: "Sí. Contamos con el equipamiento y los seguros para trabajos en altura y en consorcios. Si el edificio requiere algún permiso o reglamento interno, te ayudamos a gestionarlo." }
  ]
};
