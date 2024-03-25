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
          "Bienaventurado el hombre que halla sabiduría, y el hombre que adquiere inteligencia. Porque es mejor la sabiduría que las piedras preciosas; y todo lo que se puede desear no es de comparar con ella. Largo tiempo de días está en su mano derecha; en su izquierda, riquezas y honra. Sus caminos son caminos deleitosos, y todas sus veredas, paz. Árbol de vida es a los que de ella echan mano, y bienaventurados son los que la retienen.",
        verse: "Proverbios 3:13-18",
        date: "2024-07-01",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Bendecirá Jehová a los que temen a Jehová, a pequeños y a grandes.",
        verse: "Salmo 115:14",
        date: "2024-07-02",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Recibid mi enseñanza y no plata; y ciencia más que el oro escogido. Porque mejor es la sabiduría que las piedras preciosas; y todo lo que puedes desear, no es de comparar con ella.",
        verse: "Proverbios 8:10-11",
        date: "2024-07-03",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Y a todo hombre a quien Dios diere riquezas y bienes, y le diere también facultad para que coma de ellas, y tome su parte, y goce de su trabajo, esto es don de Dios.",
        verse: "Eclesiastés 5:19",
        date: "2024-07-04",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Bienaventurado el varón que no anduvo en consejo de malos, ni estuvo en camino de pecadores, ni en silla de escarnecedores se ha sentado; sino que en la ley de Jehová está su delicia, y en su ley medita de día y de noche. Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no cae; y todo lo que hace, prosperará.",
        verse: "Salmo 1:1-3",
        date: "2024-07-05",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Riquezas, honra y vida son la remuneración de la humildad y del temor de Jehová.",
        verse: "Proverbios 22:4",
        date: "2024-07-06",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Amado, yo deseo que tú seas prosperado en todas las cosas, y que tengas salud, así como prospera tu alma.",
        verse: "3 Juan 1:2",
        date: "2024-07-07",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content: "Todo lo puedo en Cristo que me fortalece.",
        verse: "Filipenses 4:13",
        date: "2024-07-08",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.",
        verse: "Salmo 118:24",
        date: "2024-07-09",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza por el poder del Espíritu Santo.",
        verse: "Romanos 15:13",
        date: "2024-07-10",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Concédate las peticiones de tu corazón, y cumpla todo tu consejo.",
        verse: "Salmo 20:4",
        date: "2024-07-11",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "La bendición de Jehová es la que enriquece, y no añade tristeza con ella.",
        verse: "Proverbios 10:22",
        date: "2024-07-12",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
        verse: "Jeremías 29:11",
        date: "2024-07-13",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Porque comerás el trabajo de tus manos; bienaventurado serás, y te irá bien.",
        verse: "Salmo 128:2",
        date: "2024-07-14",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "El alma generosa será prosperada; y el que saciare, él también será saciado.",
        verse: "Proverbios 11:25",
        date: "2024-07-15",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.",
        verse: "Mateo 6:33",
        date: "2024-07-16",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Dad, y se os dará; medida buena, apretada, remecida y rebosando darán en vuestro regazo; porque con la misma medida con que medís, os volverán a medir.",
        verse: "Lucas 6:38",
        date: "2024-07-17",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Se alegrarán los justos en Jehová, y confiarán en él; y se gloriarán todos los rectos de corazón.",
        verse: "Salmo 35:27",
        date: "2024-07-18",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Porque el amor al dinero es raíz de todos los males; el cual codiciando algunos, se extraviaron de la fe, y fueron traspasados de muchos dolores.",
        verse: "1 Timoteo 6:10",
        date: "2024-07-19",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Las riquezas vanas disminuirán; pero el que recoge con mano laboriosa las aumentará.",
        verse: "Proverbios 13:11",
        date: "2024-07-20",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "El avaro levanta contienda; pero el que confía en Jehová, será prosperado.",
        verse: "Proverbios 28:25",
        date: "2024-07-21",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Antes acuérdate de Jehová tu Dios, porque él te da el poder para hacer las riquezas, a fin de confirmar su pacto que juró a tus padres, como en este día.",
        verse: "Deuteronomio 8:18",
        date: "2024-07-22",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Honra a Jehová con tus bienes, y con las primicias de todos tus frutos; y serán llenos tus graneros con abundancia, y tus lagares rebosarán de mosto.",
        verse: "Proverbios 3:9-10",
        date: "2024-07-23",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Porque sol y escudo es Jehová Dios; gracia y gloria dará Jehová. No quitará el bien a los que andan en integridad.",
        verse: "Salmo 84:11",
        date: "2024-07-24",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.",
        verse: "Filipenses 4:19",
        date: "2024-07-25",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Gózate en Jehová, y él te concederá las peticiones de tu corazón.",
        verse: "Salmo 37:4",
        date: "2024-07-26",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Encomienda a Jehová tus obras, y tus pensamientos serán afirmados.",
        verse: "Proverbios 16:3",
        date: "2024-07-27",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Me coronarás de favores, y de tu mano derecha me harás heredar.",
        verse: "Salmo 65:11",
        date: "2024-07-28",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Y mi Dios proveerá a todas vuestras necesidades, conforme a sus riquezas en gloria en Cristo Jesús.",
        verse: "Filipenses 4:19",
        date: "2024-07-29",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content: "Tus testimonios son mis deleites y mis consejeros.",
        verse: "Salmo 119:24",
        date: "2024-07-30",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
      },
      {
        content:
          "Traed todos los diezmos al alfolí y haya alimento en mi casa; y probadme ahora en esto, dice Jehová de los ejércitos, si no os abriré las ventanas de los cielos, y derramaré sobre vosotros bendición hasta que sobreabunde.",
        verse: "Malaquías 3:10",
        date: "2024-07-31",
        language: "6502946f6a369b86e4f201f2",
        month: "July",
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
      console.log(code);
      console.log("daily Verse");
      var findCode = await Language.findOne({
        code: code.toString(),
      });

      console.log(findCode);
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

      let data = await DailyVerse.findOne({
        language: findCode._id,
        formattedDate: date,
      });

      if (data.verse.length > data.content.length) {
        data = {
          content: data.verse,
          verse: data.content,
          _id: data._id,
          language: data.language,
          date: data.date,
          formattedDate: data.formattedDate,
        };
      }

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
