const express = require('express');
const PDFDocument = require('pdfkit');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

// Servir archivos estáticos desde la MISMA carpeta (raíz)
app.use(express.static(__dirname));

// ========== CONTENIDO COMPLETO DEL LIBRO ==========
const libroData = [
  { pagina: 1, titulo: "DERECHOS RESERVADOS © 2025", contenido: `Esta obra está protegida por la Ley N.º 11.723 de Propiedad Intelectual de la República Argentina.\n\nTodos los derechos de reproducción, distribución, comunicación pública y transformación están reservados al autor.\n\nEstá prohibida su reproducción total o parcial por cualquier medio, actual o futuro, sin autorización expresa del autor.\n\nRegistrada bajo las normativas argentinas de protección autoral.\n\nDeclaración jurada de originalidad: esta obra es creación 100 % original del autor argentino.` },
  { pagina: 2, titulo: "Santificación boicoteada", contenido: `El eco de los gritos no emitidos tarda mucho más en disiparse,\n\nlos jadeos no pronunciados caen en escupitajos amargos,\n\nla violencia se escapa de las pupilas para adquirir sustancia,\n\nestás a un secreto de que tu mueca forzada sea insostenible\n\ny a dos de que sea ingesticulable.\n\nCuando la muerte es espiritual, la tumba es de hielo negro, transparente pero no translúcido.\n\nLo sé porque, por mucho que alguien brillara del otro lado, yo seguía igual de entenebrecido.` },
  { pagina: 3, titulo: "Dicen que la envidia atrae insectos a los sueños", contenido: `Sombras sin nada que las proyecte convergen hasta justificarse,\n\nbrota brea de esa herida que se le abre al aire.\n\nUna araña había completado ese atrapasueños, el que ahora hace bailar, burlándose de mis plumas inmóviles.\n\nNo me quejo,\n\ntal vez las inspires como a mí estos sueños rebeldes a punto de volverse materiales.` },
  { pagina: 4, titulo: "Hechizado = amor maldito", contenido: `Me siento liviano, imantado, estoy por irme de mi cuerpo.\n\nSi logro salirme de mi pecho voy a buscarte, para desbordar tus sentidos.\n\nDe antítesis a simetría, inevitable resonar, a un paso desde tan lejos.\n\nEl objetivo de cada abrazo será superponer los corazones.\n\nFundite en mí hasta que no haya un movimiento sin sinergia,\n\nninguna caricia que te dé que no se sienta un poco propia.\n\nDejame fundirme en vos hasta estar hecho de tus deseos.` },
  { pagina: 5, titulo: "Hay un puñal de estrellas que siempre apunta al norte", contenido: `¿Tantos ojos en uno sin sumarse panorama?\n\nVi más en los símbolos de uno solo.\n\nTenemos las mismas estrellas de norte, pero para mí es una cruz y para ustedes un puñal.\n\nMi cruz no está invertida; son ustedes empuñando el filo.\n\nAsí que no me acuses de lo que causas.\n\nDebe ser romanos 2:1\n\nhipócrita.` },
  { pagina: 6, titulo: "La geometría sagrada es música encriptada", contenido: `Amo traducirte flores a tablaturas para no tener que cortarlas, y por poder olvidar la teoría musical,\n\ndibujar con melodías, prometer con los ojos, flotar a contracorriente de lo que emanás.\n\n¿Habrás escuchado las promesas que no dije? \n\nVeo una amenaza en tus ojos tiernos llenos de luz.` },
  { pagina: 7, titulo: "Tengo tatuada una runa necromancer en el pecho", contenido: `Te dedico las transiciones\n\nde hilo conductor a encaje\n\nY de grietas a runas sobre los auges colapsados que creí pisos,\n\nen mis pilares derruidos; promesas rotas y de verdades que ya no son\n\ny en mi alma agrietada de aridez.\n\nPor eso llevo tatuado, sobre la somatización de lo que inspiró este libro,\n\nuno de los muchos intentos de sentirme vivo.\n\nPara darte un “yo” con algo más que desolación.` },
  { pagina: 8, titulo: "Victorias pírricas", contenido: `Progreso por regresiones, introspección en proyecciones.\n\nA veces, lo correcto es poner las piezas en sus casillas iniciales.\n\nDespués de ver mi luz retraerse y tu oscuridad propagarse, \n\nnos veo en una nueva balanza, de nuevo verticalizada, pero esta sí es justa,\n\nen la anterior, desde abajo veía tu trasfondo,\n\ny en la actual desde arriba tu conciencia ardiendo sin iluminar, degradándose.` },
  { pagina: 9, titulo: "Me dijo un pájarito que nuestro hilo no era rojo antes de que yo esté así de herido", contenido: `Me escucho sollozar a lo lejos\n\n¿Querías sugestionarme o burlarte con el muñeco que tiraste a mi patio?\n\n¿Crees si digo que no me importa? porque...\n\n¿Alguna vez trepaste por los nudos que le hicieron a tu historia?\n\nAhora, entrelazando historias, se desenreda la trama.\n\nMe parchaste los ojos, pero todo transmutó,\n\nAsí que para que no veas mis ojeras negras como tu victoria\n\nsabé que subrayan con brea mis lámparas noctámbulas,\n\nGracias a las que supe que debía soltar nuestro hilo, para que no sientas frío lejos de mí,\n\ndestejida de tu pasión encarnada.\n\nAhora entiendo tu cinismo, usabas poemarios de amor como grimorios de invocación,\n\ncomo yo las letras del metal más pesado como versos de amor.\n\nNo le pedí a Dios que rompa la maldición, dejé que siga siendo contraproducente\n\n¿No leíste que a sus escogidos todo les favorece?` },
  { pagina: 10, titulo: "A veces encuentro gualichos en mi patio", contenido: `Anduve sin dormir ni despertar del todo\n\ndeseando un alma con lo que me falta, \n\nalguna voluntad, para volver a ser.\n\nCon mi espíritu sangrando su luz hasta apagarse\n\nal ver que la vida no transcurre a la par del tiempo.\n\nCon una cinta negra abrochada al pecho, la cual no me saqué de mi yo tejido,\n\nhasta que terminar el duelo por quien debía ser\n\ny de todo lo que no viví.\n\nMi corazón dio un grito por voluntad propia, como si pudiera devolverte el humo impregnado,\n\no de un gruñido rasparme el pecho por dentro para escupir tu infección corporizada.` },
  { pagina: 11, titulo: "En el eje de los sucesos ves armonía desde el centro del caos", contenido: `¡Apofenia! ¡Ilusiones estadísticas!\n\n¡Correlaciones espurias!\n\nDa igual, sería estúpido seguir considerando todas estas casualidades como tales.\n\nSi todos tienen la frase siguiente de una sola narrativa ¿qué significa?\n\nNo me importa si es magia o si son alucinaciones.\n\nSolo puedo pensar:\n\n¡Qué reconfortante un caos tan intenso después de una tranquilidad prolongada hasta el desespero!` },
  { pagina: 12, titulo: "Maldiciones brillantes", contenido: `La serpiente tiene la lengua bifurcada como mal augurio de que viene a dividir;\n\nsi te extiende la mano tenés que verlo como demanda y no como ayuda,\n\nporque sus frases tienen interpretaciones opuestas, escuchá la maldad detrás de sus ofrecimientos.\n\nSe enrosca en los corazones que enfrió, si te volvés serpiente se podría anudar con vos, o sea que va a asfixiar cuando intentes desenredarte.` },
  { pagina: 13, titulo: "Huairavo", contenido: `Desde chico me decían que era el pájaro de los brujos.\n\nNo lo escuchaba cantar sin que le siguieran insultos.\n\nMe dijeron que anuncia la muerte,\n\ny que también es un buen o mal augurio,\n\ndependiendo de lo que haga.\n\nCada vez que el odio se me imponía, su grito me delataba.\n\nAhora, en lo que no distingo si es desidia o ataraxia,\n\ncreo que cada vez que raspa algo\n\nestá buscando lo más parecido que encontró a su canto gutural.` },
  { pagina: 14, titulo: "Imposiblemente iguales", contenido: `¿Cómo podríamos ser almas gemelas si no se le puede quitar la quiralidad a un espejo?\n\nVi nuestras almas, hechas geometría,\n\npero tu símbolo superpuesto al mío invertía mi significado.\n\nLa profundidad dibujada en dos dimensiones del espejo deja de ser ilusoria\n\ncuando te volvés invisible.\n\nDel otro lado estuve a punto de admirarte.\n\nPero para mí, la estupidez se mide por tu inteligencia para hacer el mal.` },
  { pagina: 15, titulo: "", contenido: `Dios tiene un río de felicidad de intensidad infinita,\n\nque diluye la mente para que en ella también fluya.\n\nY una paz que siempre es inconcebiblemente más profunda,\n\nque me dio mi primera noción de infinidad.\n\nLa aureola simboliza coronas superpuestas.\n\nHay un viento que hace que solo se pueda estar en la cima arrodillado,\n\npara restarle la fuerza suficiente a su empuje.\n\nNo sentado, porque no puede ser un trono.\n\nNi acostado, porque dormirse en los laureles\n\nes renunciar a la gloria dejando caer todo el aceite.` },
  { pagina: 16, titulo: "Oscureciendo en diferido", contenido: `Sin el más mínimo atisbo de expresividad,\n\nsin poder creer que esa expresión nula pueda ser tan transmitente.\n\nCon unas ojeras tan negras como la copa que acusa, pero que todos señalan.\n\nEsa copa se ennegreció antes del anochecer.\n\nNo sabíamos cómo volver a escuchar los latidos cada vez más imperceptibles\n\nde corazones que se negaban a seguir latiendo.` },
  { pagina: 17, titulo: "Zugzwang onírico", contenido: `Fui una esfera hecha de iris viendo cada ángulo, todo alrededor.\n\nTe vi limando las dos caras de la moneda del juicio\n\ncon la lija de tu lengua seca.\n\nVi un gato con sigilo absoluto,\n\nque por odio al cascabel en su correa,\n\npulió su presencia inmune.\n\n¿te gustan los símbolos?\n\ntenés el halo de la luna de aureola\n\npodrían ser la señal de los cuernos que te dibuja o de santidad,\n\nahora solo me dedico a buscar más de Dios.` }
];

// ========== RUTAS ==========
app.get('/api/libro', (req, res) => {
  res.json(libroData);
});

app.get('/api/config', (req, res) => {
  res.json({
    alias: process.env.MP_ALIAS || 'amaru77mp',
    donationLink: process.env.MP_DONATION_LINK || 'https://mpago.la/ejemplo'
  });
});

app.get('/api/descargar-pdf', (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Portal_Simetria_Antitetica_Amaru.pdf"');
    doc.pipe(res);

    doc.fontSize(22).font('Helvetica-Bold').text('Portal Simetría Antitética', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).font('Helvetica').text('Amaru Poemarios', { align: 'center' });
    doc.moveDown(2);

    libroData.forEach(pag => {
      if (pag.titulo) {
        doc.fontSize(16).font('Helvetica-Bold').text(pag.titulo, { underline: true });
        doc.moveDown(0.5);
      }
      doc.fontSize(12).font('Helvetica').text(pag.contenido, { lineGap: 5 });
      doc.moveDown(1.5);
    });

    doc.end();
  } catch (e) {
    res.status(500).send("Error al generar el PDF");
  }
});

// Cualquier otra ruta carga index.html (desde la raíz)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor público corriendo en puerto ${PORT}`);
});
