const DailyVerse = require("../models/dailyVerse");
const Language = require("../models/language");
const PrayerType = require("../models/prayer-type");
const { upload } = require("../utility/global");
const {
  SERVER_ERROR,
  OK,
  VALIDATION_ERROR,
  Messages,
} = require("../errors/statusCode");
// const query = new Query(PostCode);

module.exports = {
  create: async (req, res) => {
    const arr = [
      {
        content:
          "Por lo tanto, si alguno está en Cristo, es una nueva creación. ¡Lo antiguo ha pasado, ha llegado ya lo nuevo!",
        verse: "2 Corintios 5:17",
        date: "2014-03-01",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content: "Encomienda al Señor tu camino; confía en él, y él actuará.",
        verse: "Salmos 37:5",
        date: "2014-03-02",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El Señor es mi luz y mi salvación; ¿a quién temeré? El Señor es el baluarte de mi vida; ¿quién podrá amedrentarme?",
        verse: "Salmos 27:1",
        date: "2014-03-03",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Espera en el Señor; sé fuerte y valiente. ¡Espera en el Señor!",
        verse: "Salmos 27:14",
        date: "2014-03-04",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Confía en el Señor con todo tu corazón, y no te apoyes en tu propio entendimiento.",
        verse: "Proverbios 3:5",
        date: "2014-03-05",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content: "Todo lo puedo en Cristo que me fortalece.",
        verse: "Filipenses 4:13",
        date: "2014-03-06",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Ahora bien, sabemos que Dios dispone todas las cosas para el bien de quienes lo aman, los que han sido llamados según su propósito.",
        verse: "Romanos 8:28",
        date: "2014-03-07",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Alégrense en la esperanza, muestren paciencia en el sufrimiento, perseveren en la oración.",
        verse: "Romanos 12:12",
        date: "2014-03-08",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Más bien, busquen primeramente el reino de Dios y su justicia, y todas estas cosas les serán añadidas.",
        verse: "Mateo 6:33",
        date: "2014-03-09",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Que tu gran amor, Señor, nos acompañe, como también lo esperamos de ti.",
        verse: "Salmos 33:22",
        date: "2014-03-10",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Pongo siempre al Señor ante mí; con él a mi derecha, jamás seré conmovido.",
        verse: "Salmos 16:8",
        date: "2014-03-11",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El Señor es mi luz y mi salvación; ¿a quién temeré? El Señor es el baluarte de mi vida; ¿quién podrá amedrentarme?",
        verse: "Salmos 27:1",
        date: "2014-03-12",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Espera en el Señor; sé fuerte y valiente. ¡Espera en el Señor!",
        verse: "Salmos 27:14",
        date: "2014-03-13",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El temor del Señor es el principio de la sabiduría; el conocimiento del Santo es discernimiento.",
        verse: "Proverbios 9:10",
        date: "2014-03-14",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Confía en el Señor y haz el bien; así vivirás en la tierra y disfrutarás de seguridad.",
        verse: "Salmos 37:3",
        date: "2014-03-15",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Deleita en el Señor, y él te concederá los deseos de tu corazón.",
        verse: "Salmos 37:4",
        date: "2014-03-16",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Cercano está el Señor a los quebrantados de corazón, y salva a los de espíritu abatido.",
        verse: "Salmos 34:18",
        date: "2014-03-17",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Sé fuerte y valiente. No tengas miedo ni te desanimes, porque el Señor tu Dios estará contigo dondequiera que vayas.",
        verse: "Deuteronomio 31:6",
        date: "2014-03-18",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El Señor es mi fuerza y mi escudo; en él confía mi corazón. Con él fui ayudado, y mi corazón se alegró; con mi cántico le daré gracias.",
        verse: "Salmos 28:7",
        date: "2014-03-19",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado.",
        verse: "Isaías 26:3",
        date: "2014-03-20",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Bueno es el Señor; es refugio en el día de la angustia. Conoce a los que en él confían.",
        verse: "Nahúm 1:7",
        date: "2014-03-21",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Que el Dios de la esperanza los llene de toda alegría y paz a ustedes que creen en él, para que rebosen de esperanza por el poder del Espíritu Santo.",
        verse: "Romanos 15:13",
        date: "2014-03-22",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "En cambio, el fruto del Espíritu es amor, alegría, paz, paciencia, amabilidad, bondad, fidelidad, humildad y dominio propio. No hay ley que condene estas cosas.",
        verse: "Gálatas 5:22-23",
        date: "2014-03-23",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Busqué al Señor, y él me respondió; me libró de todos mis temores.",
        verse: "Salmos 34:4",
        date: "2014-03-24",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias.",
        verse: "Filipenses 4:6",
        date: "2014-03-25",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El Señor es mi roca, mi baluarte y mi libertador; mi Dios es mi roca, en quien encuentro protección. Él es mi escudo, el poder que me salva, ¡mi más alto escondite!",
        verse: "Salmos 18:2",
        date: "2014-03-26",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Pero los que confían en el Señor renovarán sus fuerzas; volarán como las águilas: correrán y no se fatigarán, caminarán y no se cansarán.",
        verse: "Isaías 40:31",
        date: "2014-03-27",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Te instruiré y te enseñaré el camino que debes seguir; te aconsejaré y velaré por ti.",
        verse: "Salmos 32:8",
        date: "2014-03-28",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content: "Él fortalece al cansado y acrecienta las fuerzas del débil.",
        verse: "Isaías 40:29",
        date: "2014-03-29",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Porque yo sé muy bien los planes que tengo para ustedes —afirma el Señor—, planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.",
        verse: "Jeremías 29:11",
        date: "2014-03-30",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Confía en el Señor de todo corazón, y no en tu propia inteligencia.",
        verse: "Proverbios 3:5",
        date: "2014-03-31",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
    ];

    try {
      arr.forEach(async (item) => {
        const itemDate = new Date(item.date);
        const month = itemDate.getMonth() + 1; // Month is 0-indexed, so we add 1
        const day = itemDate.getDate();
        const da = `${day}/${month}`;
        item.formattedDate = da;
        //const { content, verse, language, date } = item;
        const data = DailyVerse({
          language: item.language,
          verse: item.verse,
          content: item.content,
          month: item.month,
          date: item.date,
          formattedDate: da,
        });
        await data.save();
      });

      return res.status(OK).send({ error: false });
    } catch (err) {
      console.log(err);
      return res.status(OK).send({ error: true });
    }
  },
  todayVerse: async (req, res) => {
    try {
      const { date, code } = req.body;
      console.log("daily Verse");
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      // console.log(findCode._id);
      // const allData = await DailyVerse.findOne({
      //   language: findCode._id,
      //   formattedDate: date,
      // });
      // allData.forEach((item) => {
      //   const month = item.date.getMonth() + 1; // Month is 0-indexed, so we add 1
      //   const day = item.date.getDate();
      //   const da = `${day}/${month}`;
      //   item.formattedDate = da;
      //   item.save();
      // });

      const data = await DailyVerse.findOne({
        language: findCode._id,
        formattedDate: date,
      });

      return res.status(OK).send(data);
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },
  findAll: async (req, res) => {
    try {
      const { page = 1, limit = 10, code } = req.body;
      console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      // console.log(findCode._id);
      const data = await DailyVerse.find({ language: findCode._id })
        .skip((page - 1) * limit) // Skip documents based on the current page
        .limit(limit)
        .sort({ date: "asc" })
        .populate(language);
      return res.status(OK).send({ data: data });
    } catch (err) {
      console.log(err);
      return res.status(SERVER_ERROR).send({ error: true, message: err });
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      const data = await DailyVerse.findByIdAndDelete(id);
      return res.status(OK).send({ error: false });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },

  update: async (req, res) => {
    try {
      const id = req.params.id;

      const { content, langauge } = req.body;
      const updatedData = {
        content: content,
        langauge: langauge,
      };
      updatedData.hasUpdated = true;
      const options = { new: true };

      const result = await DailyVerse.findByIdAndUpdate(
        id,
        updatedData,
        options
      );

      return res.status(OK).send({ error: false, result });
    } catch (err) {
      return res.status(OK).send({ error: true, message: err });
    }
  },
};
