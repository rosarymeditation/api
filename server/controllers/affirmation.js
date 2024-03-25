const Affirmation = require("../models/affirmation");
const Language = require("../models/language");
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
        content: "Acepto la belleza de cada nuevo día con gratitud y alegría.",
        date: "2024-06-01",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Confío en mi capacidad para enfrentar cualquier desafío que surja.",
        date: "2024-06-02",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Soy digno de amor y cariño tal como soy.",
        date: "2024-06-03",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Soy un imán para la energía positiva y las buenas vibraciones.",
        date: "2024-06-04",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Acepto el cambio y me adapto con facilidad y gracia.",
        date: "2024-06-05",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Soy resiliente, fuerte y capaz de superar cualquier obstáculo.",
        date: "2024-06-06",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Merezco todo el éxito y la felicidad que llegan a mi vida.",
        date: "2024-06-07",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Atraigo abundancia en todas las áreas de mi vida.",
        date: "2024-06-08",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Estoy rodeado de amor y positividad dondequiera que vaya.",
        date: "2024-06-09",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Libero todo miedo y duda, reemplazándolos con confianza y certeza.",
        date: "2024-06-10",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Confío en que el universo tiene un plan para mí, y estoy exactamente donde necesito estar.",
        date: "2024-06-11",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Soy capaz de crear la vida de mis sueños.",
        date: "2024-06-12",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Irradio confianza, seguridad en mí mismo y paz interior.",
        date: "2024-06-13",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Estoy abierto a recibir milagros y bendiciones inesperadas.",
        date: "2024-06-14",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Dejo de lado los agravios del pasado y abrazo el perdón y la compasión.",
        date: "2024-06-15",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Estoy lleno de gratitud por la abundancia en mi vida.",
        date: "2024-06-16",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Confío en mis instintos y escucho mi sabiduría interior.",
        date: "2024-06-17",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Soy digno de éxito y prosperidad en todos los aspectos de mi vida.",
        date: "2024-06-18",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Atraigo experiencias positivas y enriquecedoras sin esfuerzo.",
        date: "2024-06-19",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Dejo de preocuparme y abrazo la paz y la tranquilidad.",
        date: "2024-06-20",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Estoy en constante evolución y crecimiento hacia una mejor versión de mí mismo.",
        date: "2024-06-21",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Confío en el tiempo de mi vida y me rindo al flujo divino.",
        date: "2024-06-22",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Soy el maestro de mi destino y el capitán de mi alma.",
        date: "2024-06-23",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Libero toda negatividad y abrazo la positividad en cada momento.",
        date: "2024-06-24",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Estoy abierto a recibir amor, bendiciones y milagros.",
        date: "2024-06-25",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Estoy centrado, enraizado y en paz conmigo mismo.",
        date: "2024-06-26",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Estoy rodeado de abundancia en todas sus formas.",
        date: "2024-06-27",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Soy un poderoso creador, manifestando mis deseos con facilidad.",
        date: "2024-06-28",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content:
          "Soy digno de amor, respeto y bondad de mí mismo y de los demás.",
        date: "2024-06-29",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
      },
      {
        content: "Confío en el universo para guiarme hacia mi mayor bien.",
        date: "2024-06-30",
        language: "6502946f6a369b86e4f201f2",
        month: "June",
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
        const data = Affirmation({
          language: item.language,
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
  todayAffirmation: async (req, res) => {
    try {
      const { date, code } = req.body;
      console.log(code);
      var findCode = await Language.findOne({
        code: code.toString(),
      });
      console.log("daily affirmation");
      // console.log(findCode._id);
      // const allData = await Affirmation.findOne({
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

      const data = await Affirmation.findOne({
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
      const data = await Affirmation.find({ language: findCode._id })
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
      const data = await Affirmation.findByIdAndDelete(id);
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

      const result = await Affirmation.findByIdAndUpdate(
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
