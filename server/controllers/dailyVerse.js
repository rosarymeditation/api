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
        content: "El Señor es mi pastor, nada me falta.",
        verse: "Salmo 23:1",
        date: "2023-12-01",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Y sabemos que en todas las cosas Dios obra para el bien de quienes lo aman, que han sido llamados según su propósito.",
        verse: "Romanos 8:28",
        date: "2023-12-02",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "La paz de Dios, que sobrepasa todo entendimiento, cuidará sus corazones y sus pensamientos en Cristo Jesús.",
        verse: "Filipenses 4:7",
        date: "2023-12-03",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content: "Alégrense siempre en el Señor. Insisto: ¡Alégrense!",
        verse: "Filipenses 4:4",
        date: "2023-12-04",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content: "Todo lo puedo en Cristo que me fortalece.",
        verse: "Filipenses 4:13",
        date: "2023-12-05",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Pero el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fidelidad.",
        verse: "Gálatas 5:22",
        date: "2023-12-06",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Pero el ángel les dijo: «No teman. Les traigo buenas noticias que serán motivo de mucha alegría para todo el pueblo.»",
        verse: "Lucas 2:10",
        date: "2023-12-07",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Y ahora permanecen la fe, la esperanza y el amor, estos tres; pero el mayor de ellos es el amor.",
        verse: "1 Corintios 13:13",
        date: "2023-12-08",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Cercano está el Señor a los quebrantados de corazón, y salva a los abatidos de espíritu.",
        verse: "Salmo 34:18",
        date: "2023-12-09",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Porque un niño nos ha nacido, un hijo nos ha sido dado, y la soberanía reposará sobre sus hombros. Se le darán estos nombres: Consejero admirable, Dios fuerte, Padre eterno, Príncipe de paz.",
        verse: "Isaías 9:6",
        date: "2023-12-10",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "El Señor es mi luz y mi salvación, ¿a quién temeré? El Señor es el protector de mi vida, ¿de quién tendré miedo?",
        verse: "Salmo 27:1",
        date: "2023-12-11",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Por tanto, el Señor mismo les dará señal: La virgen concebirá y dará a luz un hijo, y lo llamará Emanuel.",
        verse: "Isaías 7:14",
        date: "2023-12-12",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Considerémonos unos a otros para estimularnos al amor y a las buenas obras.",
        verse: "Hebreos 10:24",
        date: "2023-12-13",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree no se pierda, sino que tenga vida eterna.",
        verse: "Juan 3:16",
        date: "2023-12-14",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Que el Dios de la esperanza los llene de toda alegría y paz a ustedes que creen en él, para que rebosen de esperanza por el poder del Espíritu Santo.",
        verse: "Romanos 15:13",
        date: "2023-12-15",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Mas tú, Jehová, eres escudo alrededor de mí; mi gloria, y el que levanta mi cabeza.",
        verse: "Salmo 3:3",
        date: "2023-12-16",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Aquél era la verdadera luz, que alumbra a todo hombre que viene a este mundo.",
        verse: "Juan 1:9",
        date: "2023-12-17",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Gloria a Dios en las alturas, y en la tierra paz, buena voluntad para con los hombres.",
        verse: "Lucas 2:14",
        date: "2023-12-18",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Por lo cual estoy seguro de que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir, ni lo alto, ni lo profundo, ni ninguna otra cosa creada nos podrá separar del amor de Dios, que es en Cristo Jesús Señor nuestro.",
        verse: "Romanos 8:38-39",
        date: "2023-12-19",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces, en el cual no hay mudanza, ni sombra de variación.",
        verse: "Santiago 1:17",
        date: "2023-12-20",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content: "En él estaba la vida, y la vida era la luz de los hombres.",
        verse: "Juan 1:4",
        date: "2023-12-21",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Clemente y misericordioso es el Señor; lento para la ira y grande en misericordia.",
        verse: "Salmo 145:8",
        date: "2023-12-22",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Porque un niño nos ha nacido, un hijo nos ha sido dado, y la soberanía reposará sobre sus hombros. Se le darán estos nombres: Consejero admirable, Dios fuerte, Padre eterno, Príncipe de paz.",
        verse: "Isaías 9:6",
        date: "2023-12-23",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Pero el ángel les dijo: «No teman. Les traigo buenas noticias que serán motivo de mucha alegría para todo el pueblo.»",
        verse: "Lucas 2:10",
        date: "2023-12-24",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Y dará a luz un hijo, y le pondrás por nombre Jesús, porque él salvará a su pueblo de sus pecados.",
        verse: "Mateo 1:21",
        date: "2023-12-25",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "En el principio existía el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios.",
        verse: "Juan 1:1",
        date: "2023-12-26",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Y el Verbo se hizo carne y habitó entre nosotros, y vimos su gloria, gloria como del unigénito del Padre, lleno de gracia y de verdad.",
        verse: "Juan 1:14",
        date: "2023-12-27",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content: "¡Gracias a Dios por su don inefable!",
        verse: "2 Corintios 9:15",
        date: "2023-12-28",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Pero tú, Belén Efrata, pequeña entre las familias de Judá, de ti me saldrá el que será Señor en Israel; y sus salidas son desde el principio, desde los días de la eternidad.",
        verse: "Miqueas 5:2",
        date: "2023-12-29",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "La virgen concebirá y dará a luz un hijo, y le pondrán por nombre Emanuel, que traducido es: Dios con nosotros.",
        verse: "Mateo 1:23",
        date: "2023-12-30",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Y el Verbo se hizo carne y habitó entre nosotros, y vimos su gloria, gloria como del unigénito del Padre, lleno de gracia y de verdad.",
        verse: "Juan 1:14",
        date: "2023-12-31",
        language: "6502946f6a369b86e4f201f2",
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
        .populate("language");
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
