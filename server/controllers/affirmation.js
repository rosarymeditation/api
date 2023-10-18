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
        content:
          "Acepto la magia de la temporada navideña y difundo alegría a todos los que me rodean. El amor llena el aire.",
        date: "2023-12-01T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un faro de luz, iluminando el mundo con mi amabilidad, compasión y energía positiva. Soy radiante.",
        date: "2023-12-02T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy agradecido por la abundancia que me rodea. Cada día trae nuevas bendiciones y oportunidades para crecer.",
        date: "2023-12-03T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Irradio calidez y amor, creando una atmósfera armoniosa para todos. Mi corazón está abierto y soy receptivo.",
        date: "2023-12-04T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Confío en el viaje de la vida. Cada momento es una oportunidad para aprender, crecer y experimentar lo extraordinario.",
        date: "2023-12-05T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un canal de paz, emanando tranquilidad para todos. Mi presencia aporta calma a cualquier situación.",
        date: "2023-12-06T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy digno de todo el amor, éxito y abundancia que la vida tiene para ofrecer. Soy suficiente.",
        date: "2023-12-07T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy en constante evolución y me convierto en la mejor versión de mí mismo. Cada día es un paso adelante.",
        date: "2023-12-08T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy abierto a recibir milagros y bendiciones. El universo tiene maravillosos planes para mí.",
        date: "2023-12-09T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy una fuente de inspiración y positividad. Mis palabras y acciones tienen un impacto significativo en los demás.",
        date: "2023-12-10T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un imán para las experiencias positivas. Mi vida está llena de momentos de alegría, amor y prosperidad.",
        date: "2023-12-11T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Confío en el momento divino del universo. Todo se está revelando para mi mayor bien.",
        date: "2023-12-12T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un canal de paz y serenidad. Mi presencia aporta calma a cualquier situación.",
        date: "2023-12-13T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy abierto a recibir orientación de mi sabiduría interior. Confío en mi intuición para guiarme.",
        date: "2023-12-14T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un faro de amor, irradiando calor y compasión a quienes me rodean. El amor es mi esencia.",
        date: "2023-12-15T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy abierto a recibir milagros. Los milagros son una parte natural de mi vida cotidiana.",
        date: "2023-12-16T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Libero todas las preocupaciones y abrazo la paz. Mi mente está tranquila y mi corazón está en paz.",
        date: "2023-12-17T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un canal de amor y luz divina. Irradio amor a todos los seres que me rodean.",
        date: "2023-12-18T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy abierto a recibir abundancia en todas sus formas. La abundancia fluye hacia mí sin esfuerzo.",
        date: "2023-12-19T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un faro de luz, llevando positividad y esperanza a quienes cruzan mi camino.",
        date: "2023-12-20T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un canal de paz, irradiando calma y serenidad al mundo. Estoy en paz.",
        date: "2023-12-21T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy digno de todo el amor, éxito y abundancia que la vida tiene para ofrecer. Soy suficiente.",
        date: "2023-12-22T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy en constante crecimiento y evolución. Cada día, me convierto en una mejor versión de mí mismo.",
        date: "2023-12-23T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy abierto a recibir milagros y bendiciones. Confío en que el universo tiene planes maravillosos para mí.",
        date: "2023-12-24T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un canal de paz y tranquilidad. Mi presencia aporta calma a quienes me rodean.",
        date: "2023-12-25T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Estoy rodeado de almas solidarias y amorosas. Aprecio las relaciones positivas en mi vida.",
        date: "2023-12-26T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy merecedor de todo lo bueno que la vida tiene para ofrecer. Acepto la abundancia con los brazos abiertos.",
        date: "2023-12-27T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Los desafíos son oportunidades para crecer. Enfrento la adversidad con valentía, saliendo más fuerte cada vez.",
        date: "2023-12-28T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un imán para los milagros. Los milagros me rodean y se manifiestan en mi vida todos los días.",
        date: "2023-12-29T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Libero todas las preocupaciones y abrazo la paz. Mi mente está tranquila y mi corazón está en paz.",
        date: "2023-12-30T00:00:00",
        language: "6502946f6a369b86e4f201f2",
      },
      {
        content:
          "Soy un canal para el amor y la luz divina. Irradio amor a todos los seres que me rodean.",
        date: "2023-12-31T00:00:00",
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
        const data = Affirmation({
          language: item.language,
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
