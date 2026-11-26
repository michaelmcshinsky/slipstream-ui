import type { MarketingCopy } from './types';

export const es: MarketingCopy = {
  home: {
    whatsNew: 'novedades →',
    aiFirstBadge: 'IA primero · MIT',
    reactBadge: 'React 18+',
    heroTitleLead: 'Tu IA ya conoce',
    heroTitleHighlight: 'tu sistema de diseño',
    heroDescription:
      'Slipstream UI es el sistema de componentes pensado para el desarrollo asistido por IA. Cada componente incluye una especificación legible por máquina, un servidor MCP que la sirve y un validador que mantiene a los agentes honestos.',
    getStarted: 'Empezar',
    starOnGithub: 'Dar estrella en GitHub',
    copy: 'copiar',
    copied: 'copiado',
    liveDemoNote: 'demostración en vivo: creada solo con Slipstream UI',
    welcomeTitle: 'Pregunta sobre Slipstream',
    welcomeSuggestions: ['¿Qué lo hace diferente?', '¿Cómo funciona el manifiesto?'],
    promptPlaceholder: 'Pruébame…',
    send: 'Enviar',
    agentStripLabel: 'Habla con fluidez con',
    aiAssistantsNote: 'Para asistentes de IA',
    stats: ['componentes', 'especificaciones legibles por máquina', 'herramientas MCP para agentes', 'falsos positivos en uso válido'],
    featuresHeading: 'Creado para cómo se escribe el software hoy',
    featuresIntro:
      'La mitad de tu interfaz la escriben modelos. Slipstream les da algo mejor que documentación extraída de los datos de entrenamiento: una especificación que pueden consultar y una guía con la que pueden autocorregirse.',
    features: [
      {
        title: 'Manifiestos legibles por máquina',
        body: 'Cada componente incluye un COMPONENT_MANIFEST: esquema exacto de props, valores predeterminados, antipatrones, requisitos de accesibilidad y reglas de composición.',
      },
      {
        title: 'Herramienta MCP validate_usage',
        body: 'Los agentes validan el JSX generado contra el manifiesto antes de emitirlo: las props inventadas y los campos obligatorios ausentes se detectan antes de publicarse.',
      },
      {
        title: 'Registro compatible con shadcn',
        body: 'Instala archivos fuente reales con cualquier CLI compatible con shadcn o usa paquetes. Tu código, tus reglas.',
      },
      {
        title: 'Totalmente sin estado',
        body: 'Sin dependencia de runtime. Usa cualquier backend: Vercel AI SDK, LangGraph o streams directos. Los componentes renderizan; tú controlas el estado.',
      },
      {
        title: 'Accesibilidad probada',
        body: 'Suites jest-axe en cada componente, estados de streaming con aria-busy, anuncios de finalización corteses y variantes de movimiento reducido.',
      },
      {
        title: 'Tematizable hasta el token',
        body: 'Una llamada a createTheme() emite cada variable CSS. Radio, modo oscuro y cambio instantáneo, sin recompilar.',
      },
    ],
    howHeading: 'Cómo lo usa tu IA',
    howIntro: 'Tres pasos, sin ajuste fino ni conjuros en el prompt.',
    steps: [
      {
        title: 'Conecta',
        body: 'Apunta Claude Code o Cursor al servidor MCP de Slipstream, o sirve llms.txt y las rutas markdown /llm.',
      },
      {
        title: 'Consulta la especificación',
        body: 'El agente llama a get_component_manifest y get_usage_examples: props exactas, valores predeterminados y antipatrones.',
      },
      {
        title: 'Autovalida',
        body: 'Antes de emitir, validate_usage comprueba el JSX generado contra el manifiesto y corrige las props inventadas.',
      },
    ],
    validatorHeading: 'El fallo, detectado',
    validatorIntroBefore: 'Un agente adivina',
    validatorIntroAfter: 'y comprueba el manifiesto: el fragmento se rechaza antes de escribirse.',
    validatorCards: [
      { title: '1. Uso inventado', note: 'La prop no existe y falta el onSubmit obligatorio.' },
      { title: '2. Respuesta de validate_usage', note: 'Recortada para mostrarla; la herramienta también devuelve los antipatrones del manifiesto.' },
      { title: '3. Uso correcto', note: 'Validado con el mismo contrato que sirven tus docs, el servidor MCP y el registro.' },
    ],
    themesHeading: 'Temas incluidos en la biblioteca',
    themesIntro: 'Incluye los preajustes Default, Violet y Zinc. Cambia abajo: es tematización en vivo, no una captura.',
    comparisonHeading: 'Cómo se compara',
    comparisonIntro: 'Otras bibliotecas documentan para humanos. Slipstream documenta para ambos.',
    comparisonCapability: 'Capacidad',
    comparisonCapabilities: [
      'Modelo de distribución',
      'Componentes incluidos',
      'Especificación legible por máquina por componente',
      'Servidor MCP',
      'Valida el JSX generado contra la especificación',
      'llms.txt',
      'Markdown canónico por componente/página',
      'Componentes de chat de IA',
      'Estado y transporte',
      'Estilos',
      'Preajustes de tema',
      'Dependencias entre pares',
      'Licencia',
    ],
    comparisonFootnote:
      'Refleja la documentación pública y los paquetes publicados de cada proyecto en noviembre de 2026 · ✅ incluido · 🟡 parcial o con otro modelo ·: no incluido para este fin',
    comparisonCards: [
      {
        title: 'Elige Slipstream',
        body: 'Cuando los agentes deben generar código correcto y conforme al sistema de diseño, y quieres un validador antes de publicar.',
      },
      {
        title: 'Elige shadcn/ui + AI Elements',
        body: 'Cuando importan sobre todo la gravedad del ecosistema y la propiedad del código de una base de primitivas muy amplia.',
      },
      {
        title: 'Elige assistant-ui',
        body: 'Cuando necesitas un runtime de chat probado: streaming, herramientas e interfaz generativa como producto principal.',
      },
    ],
    comparisonRows: [
      {
        slipstream: 'paquetes npm (ESM + CJS)',
        shadcn: 'código copiado con la CLI',
        assistantUi: 'paquetes npm',
        mui: 'paquetes npm',
      },
      {
        slipstream: '{componentCount} ({coreComponentCount} de UI + {aiComponentCount} de IA)',
        shadcn: 'primitivas de UI + AI Elements',
        assistantUi: 'superficie de chat + primitivas',
        mui: 'amplio conjunto de UI, sin chat',
      },
      {
        slipstream: 'Sí: props, a11y, antipatrones',
        shadcn: 'Parcial: registry.json (archivos, dependencias)',
        assistantUi: 'No',
        mui: 'No',
      },
      {
        slipstream: 'Sí: 6 herramientas, incl. validate_usage',
        shadcn: 'Parcial: explorar, buscar e instalar',
        assistantUi: 'No',
        mui: 'Parcial: skills para agentes',
      },
      { slipstream: 'Sí: validate_usage', shadcn: 'No', assistantUi: 'No', mui: 'No' },
      { slipstream: 'Sí', shadcn: 'Sí', assistantUi: 'Sí', mui: 'No' },
      {
        slipstream: 'Sí: /llm/*.md',
        shadcn: 'Parcial: MDX en el repositorio',
        assistantUi: 'Sí: páginas .md',
        mui: 'No',
      },
      {
        slipstream: 'Sí: {aiComponentCount} integrados',
        shadcn: 'Sí: AI Elements (aparte)',
        assistantUi: 'Sí: foco principal',
        mui: 'No',
      },
      {
        slipstream: 'Sin estado: tú aportas el backend',
        shadcn: 'Solo componentes',
        assistantUi: 'Adaptadores de runtime (AI SDK, LangGraph, propios)',
        mui: 'n/a: sin componentes de chat',
      },
      {
        slipstream: 'Tailwind + variables CSS',
        shadcn: 'Tailwind + variables CSS',
        assistantUi: 'Tailwind',
        mui: 'Emotion + objeto de tema',
      },
      {
        slipstream: '4 (Default, Dark, Violet, Zinc)',
        shadcn: 'temas con variables CSS',
        assistantUi: 'variables CSS',
        mui: 'objeto de tema',
      },
      {
        slipstream: 'react, react-dom',
        shadcn: 'react',
        assistantUi: 'react',
        mui: 'react, @emotion/react, @emotion/styled',
      },
      { slipstream: 'MIT', shadcn: 'MIT', assistantUi: 'MIT', mui: 'MIT' },
    ],
    templatesHeading: 'Empieza desde una plantilla',
    templatesIntro: 'Patrones completos para copiar y pegar, construidos solo con componentes de Slipstream.',
    browseTemplates: 'Ver todas las plantillas →',
    templates: [
      { name: 'Chat en streaming', body: 'Respuestas markdown, detener generación, fijar el scroll y acciones de comentarios.' },
      { name: 'Panel de agentes', body: 'Llamadas a herramientas con aprobación humana, pasos de razonamiento y progreso de tareas.' },
      { name: 'Citas RAG', body: 'Respuestas fundamentadas con chips de citas en línea y pie de fuentes.' },
    ],
    agentPathTitle: 'Para quien construye agentes →',
    agentPathBody:
      'Conecta el servidor MCP a Claude Code o Cursor, ejecuta validate_usage antes de emitir o sirve llms.txt y las rutas markdown: seis herramientas, tres formas de consumo.',
    productPathTitle: 'Para equipos de producto →',
    productPathBody:
      'Publica la superficie de chat de producción —markdown en streaming, detener generación, citas, aprobaciones— con componentes sin estado, cobertura jest-axe y tu propio backend.',
    ctaHeading: 'Publica interfaces de IA más rápido',
    ctaBody:
      '{componentCount} componentes · {componentCount} especificaciones legibles por máquina · valida el uso generado antes de publicar.',
    startBuilding: 'Empezar a construir',
    demo: {
      you: 'Tú',
      assistant: 'Asistente',
      initialMessage: '¿Qué hace diferente a Slipstream UI?',
      reply: `Slipstream UI incluye **{componentCount} componentes listos para producción** ({coreComponentCount} del núcleo + {aiComponentCount} de IA), cada uno con un \`COMPONENT_MANIFEST\` legible por máquina.

El laboratorio de esta página ejecuta la biblioteca real: selección y paginación de DataTable, MetricCard, SelectMenu, InputGroup, ButtonGroup, ConfirmDialog, Drawer, toasts imperativos y Stepper.

Tu agente consulta los mismos manifiestos por MCP, lee el esquema de props y los antipatrones, y valida su propia salida antes de emitir código. Interfaz correcta al primer intento.`,
      anyMcpClient: 'Cualquier cliente MCP',
      transcriptLabel: 'Transcripción de la conversación',
      responseComplete: 'Respuesta completada.',
    },
    lab: {
      eyebrow: 'Demostración en vivo',
      title: 'El framework, ejecutándose en esta página',
      description:
        'Sin capturas. Cada control de abajo es un componente de Slipstream: selección, paginación, menús, superposiciones, toasts y asistentes incluidos.',
      footer:
        'Cada componente incluye un COMPONENT_MANIFEST, pruebas y una página de docs en vivo. Este laboratorio es la misma biblioteca que tu agente consulta por MCP.',
      tabs: { data: 'Datos', forms: 'Formularios', overlays: 'Superposiciones', flow: 'Flujo' },
      data: {
        caption: 'Ejecuciones de automatización',
        activeRuns: 'Ejecuciones activas',
        thisWeek: 'esta semana',
        selected: 'Seleccionado',
        selectedOne: '{count} seleccionado',
        selectedOther: '{count} seleccionados',
        useTheCheckboxes: 'usa las casillas',
        successRate: 'Tasa de éxito',
        vsLastWeek: 'vs la semana pasada',
        columns: { workflow: 'Flujo de trabajo', status: 'Estado', owner: 'Propietario', seats: 'Plazas' },
        runs: {
          onboardingEmails: 'Correos de incorporación',
          invoiceSync: 'Sincronización de facturas',
          churnScoring: 'Puntuación de abandono',
          weeklyDigest: 'Resumen semanal',
          leadEnrichment: 'Enriquecimiento de leads',
          accessReview: 'Revisión de accesos',
        },
        statuses: { success: 'éxito', warning: 'advertencia', info: 'info' },
        archive: 'Archivar',
        clear: 'Limpiar',
        archivedOne: '{count} ejecución archivada',
        archivedOther: '{count} ejecuciones archivadas',
      },
      forms: {
        selectMenuCaption: 'SelectMenu: opciones enriquecidas y grupos',
        inputGroupCaption: 'InputGroup: complementos integrados',
        buttonGroupCaption: 'ButtonGroup: segmentos unidos',
        planLabel: 'Plan',
        domainLabel: 'Dominio del sitio',
        viewModeLabel: 'Modo de vista',
        views: { list: 'Lista', board: 'Tablero', calendar: 'Calendario' },
        plans: {
          free: { label: 'Gratis', description: '1 proyecto, soporte de la comunidad' },
          pro: { label: 'Pro', description: 'Proyectos ilimitados, soporte prioritario' },
          team: { label: 'Equipo', description: 'SSO, registro de auditoría, facturación compartida' },
        },
        planGroups: { individual: 'Individual', business: 'Empresa' },
        summary: 'plan: {plan} · vista: {view} · dominio: {domain}',
      },
      overlays: {
        deleteProject: 'Eliminar proyecto…',
        openDrawer: 'Abrir panel',
        description:
          'ConfirmDialog gestiona el foco atrapado, Escape y un estado pendiente asíncrono; los toasts son imperativos (toast.success()) y se apilan sobre cualquier superposición.',
        confirmTitle: '¿Eliminar el proyecto?',
        confirmDescription:
          'Esto elimina el proyecto y sus ejecuciones de forma permanente. No se puede deshacer.',
        confirm: 'Eliminar',
        deleted: 'Proyecto eliminado',
        savedTitle: 'Guardado',
        savedBody: 'Tus cambios ya están activos',
        rateLimitedTitle: 'Límite alcanzado',
        rateLimitedBody: 'Reintentando en 3 s',
        headsUpTitle: 'Atención',
        headsUpBody: 'Hay una versión nueva',
        drawerTitle: 'Filtrar ejecuciones',
        drawerDescription: 'Panel con formulario; se cierra con Escape o con el fondo.',
        noteLabel: 'Nota',
        notePlaceholder: 'Solo ejecuciones fallidas, últimas 24 h…',
        apply: 'Aplicar',
        applied: 'Filtro aplicado',
        noNote: 'Sin nota',
      },
      flow: {
        steps: {
          basics: { label: 'Básicos', description: 'Nombre y propietario' },
          access: { label: 'Acceso', description: 'Roles y SSO' },
          billing: { label: 'Facturación', description: 'Plan y plazas' },
          review: { label: 'Revisión' },
        },
        summary: 'Paso {current} de {total}: {label}',
        descriptionSuffix: ' ({description})',
        back: 'Atrás',
        next: 'Siguiente',
        states: { completed: ' (completado)', current: ' (paso actual)', upcoming: ' (próximo)' },
      },
    },
  },
  about: {
    title: 'Acerca de Slipstream UI',
    description:
      'Un proyecto pequeño de código abierto con una sola tesis: los agentes de código también son usuarios y merecen contratos legibles por máquina.',
    updated: 'noviembre de 2026',
    sections: [
      {
        heading: 'Por qué existe',
        blocks: [
          {
            type: 'p',
            text: 'Los asistentes de código son buenos escribiendo React y malos recordando los nombres exactos de las props, los campos obligatorios y las reglas de accesibilidad de un sistema de diseño que nunca han visto. La solución habitual es más contexto en el prompt o un README más grande: ambos se desactualizan en cuanto cambia un componente.',
          },
          {
            type: 'p',
            text: 'Slipstream UI invierte la dirección: la fuente de verdad viaja con el código. Cada uno de los {componentCount} componentes incluye un `COMPONENT_MANIFEST`; un servidor MCP sirve esos manifiestos y `validate_usage` comprueba el JSX generado contra ellos antes de llegar a tu editor.',
          },
        ],
      },
      {
        heading: 'Principios',
        blocks: [
          {
            type: 'ul',
            items: [
              '**Los agentes son usuarios de primera clase.** Un contrato que un agente puede consultar importa tanto como una tabla de props que una persona puede leer.',
              '**Sin estado por diseño.** Los componentes renderizan; tú controlas el estado, el transporte y los datos. Sin dependencia de runtime ni proveedores ocultos.',
              '**La accesibilidad no es una variante.** El comportamiento de teclado, el cableado ARIA y las rutas de movimiento reducido forman parte del contrato del componente y están cubiertos por suites jest-axe.',
              '**El código es tuyo.** Instala con paquetes npm o el registro compatible con shadcn y conserva el código en tu repositorio.',
            ],
          },
        ],
      },
      {
        heading: 'Quién lo mantiene',
        blocks: [
          {
            type: 'p',
            text: 'Slipstream UI se construye y mantiene en abierto por [Michael McShinsky]({githubProfile}). Las incidencias, discusiones y pull requests son bienvenidas en el [repositorio de GitHub]({repo}).',
          },
          {
            type: 'p',
            text: 'Versión actual: `v{version}`. El proyecto sigue versionado semántico y publica desde CI con procedencia de npm.',
          },
        ],
      },
      {
        heading: 'Cómo verificar las afirmaciones',
        blocks: [
          {
            type: 'ul',
            items: [
              '[Lee un manifiesto](/docs/ai-manifests) y compáralo con el código del componente.',
              '[Ejecuta el servidor MCP](/docs/mcp) y llama a `validate_usage` con un fragmento deliberadamente roto.',
              '[Revisa la declaración de accesibilidad](/accessibility) y el alcance de la auditoría automática.',
              '[Política de seguridad]({repo}/blob/main/SECURITY.md) y [security.txt](/.well-known/security.txt).',
            ],
          },
        ],
      },
    ],
  },
  contact: {
    title: 'Contacto',
    description: 'Contacta con los mantenedores en GitHub: errores, preguntas y reportes de seguridad tienen un canal dedicado.',
    channels: [
      {
        heading: 'Informes de errores',
        body: '¿Algo roto o con comportamiento inesperado? [Abre un issue]({repo}/issues/new) con la página, la tecnología de asistencia o el agente que usaste y lo que esperabas.',
        ctaLabel: 'Abrir un issue',
        ctaHref: '{repo}/issues/new',
      },
      {
        heading: 'Preguntas e ideas',
        body: 'Las preguntas de uso, las ideas de funciones y los «¿existe esto?» van en [GitHub Discussions]({repo}/discussions).',
        ctaLabel: 'Iniciar una discusión',
        ctaHref: '{repo}/discussions',
      },
      {
        heading: 'Seguridad',
        body: 'No publiques vulnerabilidades de seguridad. Sigue la [política de seguridad]({repo}/blob/main/SECURITY.md) para reportes privados.',
        ctaLabel: 'Leer SECURITY.md',
        ctaHref: '{repo}/blob/main/SECURITY.md',
      },
    ],
  },
  accessibility: {
    title: 'Declaración de accesibilidad',
    description:
      'Slipstream UI apunta a WCAG 2.2 nivel AA tanto para la biblioteca de componentes como para este sitio de documentación.',
    updated: 'noviembre de 2026',
    sections: [
      {
        heading: 'Objetivo de conformidad',
        blocks: [
          {
            type: 'p',
            text: 'La biblioteca de componentes y este sitio se desarrollan conforme a [WCAG 2.2 nivel AA](https://www.w3.org/TR/WCAG22/). Las regresiones de accesibilidad se tratan como errores, no como mejoras.',
          },
          {
            type: 'p',
            text: 'Esta declaración cubre la evidencia automática de conformidad y las carencias conocidas. No es una afirmación de conformidad manual completa: las pruebas con tecnologías de asistencia y personas reales siguen en curso.',
          },
        ],
      },
      {
        heading: 'Cómo se prueba la biblioteca',
        blocks: [
          {
            type: 'ul',
            items: [
              '**Suites jest-axe** en cada componente, ejecutadas en CI en cada pull request.',
              '**Comportamiento de teclado** implementado como parte del contrato del componente (tabindex móvil en widgets compuestos, manejo de Escape/flechas, anillos de foco visibles).',
              '**Movimiento reducido** respetado por indicadores de streaming, paneles, diálogos y desplazamientos.',
              '**Contratos ARIA** documentados en cada COMPONENT_MANIFEST y aplicados por las mismas reglas que ven los agentes por MCP.',
            ],
          },
          {
            type: 'p',
            text: 'Lee la [guía de accesibilidad para interfaz generada por IA](/docs/guides/accessibility-ai) para el detalle por componente.',
          },
        ],
      },
      {
        heading: 'Cómo se prueba este sitio',
        blocks: [
          {
            type: 'p',
            text: 'El sitio de documentación ejecuta una auditoría automática con axe-core sobre sus rutas principales como parte de la lista de publicación. La auditoría cubre las reglas A y AA de WCAG 2.0/2.1/2.2 y es reproducible desde el repositorio:',
          },
          {
            type: 'code',
            text: 'pnpm --filter slipstream-ui-docs build\npnpm --filter slipstream-ui-docs start -- -p 3111\npnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111',
          },
          {
            type: 'p',
            text: 'Rutas cubiertas: inicio, índice de docs, instalación, páginas de componentes representativas, MCP, plantillas, novedades, acerca de, esta página, contacto y las páginas legales. Cada ruta se audita en **modo claro y oscuro**. El 4 de noviembre de 2026 la suite superó las 13 rutas en ambos esquemas (26 ejecuciones, 0 infracciones) y Lighthouse informó Accesibilidad 100 en las rutas muestreadas.',
          },
          {
            type: 'p',
            text: 'Las herramientas automáticas detectan un subconjunto de problemas; no pueden validar el orden de lectura, la finalización de tareas ni la calidad del texto alternativo.',
          },
        ],
      },
      {
        heading: 'Limitaciones conocidas',
        blocks: [
          {
            type: 'ul',
            items: [
              'La auditoría manual completa con lector de pantalla (NVDA en Windows, VoiceOver en macOS/iOS) aún no ha terminado. La cobertura automática no es un sustituto.',
              'El contenido de terceros enlazado desde los docs (GitHub, páginas de estándares externas) queda fuera de nuestro control.',
              'Algunas demostraciones interactivas simulan streaming y comportamiento de agentes con temporizadores; son ilustrativas y operables por teclado, pero no transportes de producción.',
            ],
          },
        ],
      },
      {
        heading: 'Informar de una barrera',
        blocks: [
          {
            type: 'p',
            text: 'Si algo te bloquea, [abre una incidencia]({repo}/issues/new) con la página, la tecnología de asistencia que usaste y lo que esperabas. Los informes sensibles a la seguridad deben seguir la [política de seguridad]({repo}/blob/main/SECURITY.md). También puedes escribir a [{email}](mailto:{email}).',
          },
          { type: 'p', text: 'Pretendemos acusar recibo de los informes de accesibilidad en cinco días laborables.' },
        ],
      },
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    description:
      'En resumen: guardamos tu preferencia de tema, solo medimos el tráfico si aceptas cookies y nunca mostramos anuncios ni hacemos seguimiento entre sitios.',
    updated: 'noviembre de 2026',
    sections: [
      {
        heading: 'Qué guardamos en tu dispositivo',
        blocks: [
          {
            type: 'ul',
            items: [
              '`slipstream-theme`: tu preferencia de tema claro/oscuro, para que el sitio no muestre el tema equivocado.',
              '`slipstream-consent`: tu elección de cookies, para no volver a preguntar.',
            ],
          },
          { type: 'p', text: 'Ningún valor se envía a un servidor. Borrar los datos del sitio restablece ambos.' },
        ],
      },
      {
        heading: 'Analítica',
        blocks: [
          {
            type: 'p',
            text: 'La analítica está **desactivada por defecto**. Si eliges «Aceptar todo», cargamos Google Analytics 4 (ID de medición `G-QDQXNJV9MD`). Establece cookies propias `_ga` y registra visitas de página, la página de referencia e información aproximada de dispositivo y navegador. GA4 no registra ni almacena direcciones IP, y desactivamos Google Signals y las señales de personalización publicitaria para que la propiedad solo genere informes agregados. Google trata estos datos por nuestra cuenta como encargado y puede almacenarlos fuera de tu país.',
          },
          {
            type: 'p',
            text: 'Nunca cargamos scripts publicitarios, de retargeting ni de repetición de sesión. Puedes retirar el consentimiento en cualquier momento borrando los datos de este sitio en tu navegador —eso también elimina las cookies `_ga`—; el aviso volverá a aparecer en tu próxima visita.',
          },
        ],
      },
      {
        heading: 'Mensajes de contacto',
        blocks: [
          {
            type: 'p',
            text: 'Cuando usas el formulario de contacto recibimos el nombre, el correo y el mensaje que envías. Nuestro proveedor de alojamiento (Netlify Forms) procesa los envíos y solo se usan para responderte. Los conservamos hasta 24 meses.',
          },
        ],
      },
      {
        heading: 'Solicitudes a terceros',
        blocks: [
          {
            type: 'p',
            text: 'La página de inicio muestra un recuento real de estrellas de GitHub solicitando la API pública de GitHub desde tu navegador. Como cualquier solicitud a github.com, eso expone tu dirección IP y agente de usuario a GitHub según su política de privacidad. Esa solicitud no establece cookies. El único otro recurso de terceros es la etiqueta de Google Analytics descrita arriba, y solo se carga cuando aceptas la analítica.',
          },
        ],
      },
      {
        heading: 'Registros de alojamiento',
        blocks: [
          {
            type: 'p',
            text: 'Nuestro proveedor de alojamiento registra solicitudes estándar (dirección IP, agente de usuario, URL solicitada) por seguridad y prevención de abusos, conservados según su política.',
          },
        ],
      },
      {
        heading: 'Lo que no hacemos',
        blocks: [
          {
            type: 'ul',
            items: [
              'Sin píxeles publicitarios ni de retargeting.',
              'No vendemos ni alquilamos datos personales.',
              'Sin perfiles publicitarios ni seguimiento entre sitios.',
            ],
          },
        ],
      },
      {
        heading: 'Tus derechos',
        blocks: [
          {
            type: 'p',
            text: 'Según dónde vivas, puedes tener derecho a acceder, corregir, exportar o eliminar los datos personales que tenemos sobre ti y a oponerte al tratamiento. Escribe a [{email}](mailto:{email}) y responderemos en 30 días. También puedes presentar una reclamación ante tu autoridad de control.',
          },
        ],
      },
      {
        heading: 'Menores',
        blocks: [{ type: 'p', text: 'El sitio es un recurso para desarrolladores y no está dirigido a menores de 16 años.' }],
      },
      {
        heading: 'Cambios',
        blocks: [
          {
            type: 'p',
            text: 'Actualizaremos esta página y su fecha de «última actualización» cuando cambien las prácticas. Consulta también nuestros [términos de uso](/terms).',
          },
        ],
      },
      {
        heading: 'Contacto',
        blocks: [{ type: 'p', text: 'Dudas sobre esta política: [{email}](mailto:{email}).' }],
      },
    ],
  },
  terms: {
    title: 'Términos de uso',
    description: 'Términos en lenguaje claro para este sitio y los paquetes de Slipstream UI.',
    updated: 'noviembre de 2026',
    sections: [
      {
        heading: 'El software',
        blocks: [
          {
            type: 'p',
            text: 'Los paquetes de Slipstream UI se publican bajo la [licencia MIT]({repo}/blob/main/LICENSE). Puedes usarlos, modificarlos y redistribuirlos comercialmente siempre que incluyas el aviso de copyright y de permiso. El texto de la licencia prevalece si entra en conflicto con esta página.',
          },
        ],
      },
      {
        heading: 'Sin garantía',
        blocks: [
          {
            type: 'p',
            text: 'El sitio, la documentación, los manifiestos, las herramientas MCP y los paquetes se ofrecen **tal cual**, sin garantía de ningún tipo, expresa o implícita, incluida la idoneidad para un fin concreto. Eres responsable de revisar el código generado y de tus propias decisiones de producto.',
          },
        ],
      },
      {
        heading: 'Uso aceptable',
        blocks: [
          {
            type: 'ul',
            items: [
              'No uses el sitio para infringir la ley, vulnerar derechos o distribuir malware.',
              'No intentes interrumpir ni sobrecargar la infraestructura de alojamiento.',
              'No presentes versiones modificadas de los paquetes como publicaciones oficiales.',
              'Los límites de velocidad y las expectativas de uso razonable se aplican a cualquier endpoint alojado.',
            ],
          },
        ],
      },
      {
        heading: 'Limitación de responsabilidad',
        blocks: [
          {
            type: 'p',
            text: 'En la máxima medida permitida por la ley, los mantenedores no son responsables de daños indirectos, incidentales o consecuentes, ni de pérdida de beneficios o datos derivados del uso del sitio o los paquetes.',
          },
        ],
      },
      {
        heading: 'Enlaces y servicios de terceros',
        blocks: [
          {
            type: 'p',
            text: 'El sitio enlaza a GitHub, npm y otros servicios de terceros. Sus términos y políticas de privacidad se aplican a tu uso de esos servicios.',
          },
        ],
      },
      {
        heading: 'Cambios',
        blocks: [
          {
            type: 'p',
            text: 'Podemos actualizar estos términos; la fecha de «última actualización» cambiará en consecuencia. Seguir usando el sitio tras una actualización significa que aceptas los términos revisados.',
          },
        ],
      },
      {
        heading: 'Contacto',
        blocks: [
          {
            type: 'p',
            text: 'Dudas sobre estos términos: [{email}](mailto:{email}). Consulta también la [política de privacidad](/privacy).',
          },
        ],
      },
    ],
  },
};
