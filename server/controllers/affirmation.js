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
          "Hoy, acepto el cambio como un catalizador para el crecimiento y la transformación. Soy adaptable y recibo nuevas oportunidades con los brazos abiertos.",
        date: "2014-03-01",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Irradio positividad e inspiración a quienes me rodean. Mis acciones levantan a otros, difundiendo alegría y aliento sin esfuerzo.",
        date: "2014-03-02",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Mi resistencia no tiene límites. Cada contratiempo es un peldaño hacia mayores logros. Me levanto más fuerte y decidido cada vez.",
        date: "2014-03-03",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Aprovecho el día, convirtiendo cada momento en un escalón hacia mis sueños y aspiraciones. Soy proactivo y determinado.",
        date: "2014-03-04",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Con una determinación inquebrantable, alineo mis acciones con mis metas. Confío en mi camino y abrazo la senda que conduce a mi éxito.",
        date: "2014-03-05",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Cada día es una oportunidad para manifestar mis deseos. Soy un imán para el éxito y la abundancia en cada aspecto de mi vida.",
        date: "2014-03-06",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El amor y la compasión guían mi corazón. Elijo la amabilidad y la empatía, creando armonía y comprensión en todas las interacciones.",
        date: "2014-03-07",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Pinto cada día con pinceladas de gratitud y positividad. Atraigo sin esfuerzo el éxito y la abundancia a mi vida.",
        date: "2014-03-08",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Mi determinación es inquebrantable. Estoy comprometido a alcanzar mis metas, superando cualquier obstáculo que se interponga en mi camino.",
        date: "2014-03-09",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Soy el arquitecto de mi destino, diseñando una vida llena de alegría y propósito. Soy capaz de lograr la grandeza.",
        date: "2014-03-10",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Doy la bienvenida a la abundancia en mi vida. El universo conspira a mi favor, presentándome oportunidades ilimitadas para el crecimiento y el éxito.",
        date: "2014-03-11",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Mi determinación no tiene límites. Estoy enfocado, impulsado y me acerco más a mis sueños con cada día que pasa.",
        date: "2014-03-12",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "La confianza y la positividad fluyen en mí sin esfuerzo. Atraigo el éxito y triunfo sobre los desafíos con facilidad.",
        date: "2014-03-13",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El amor es mi fuerza guía. Abrazo el amor en todas sus formas, difundiendo compasión y alegría donde quiera que vaya.",
        date: "2014-03-14",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Tengo el poder de dar forma a mi realidad. Mis acciones conducen al éxito y atraigo la abundancia sin esfuerzo.",
        date: "2014-03-15",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Cada experiencia es un peldaño hacia el crecimiento. Aprendo, me adapto y evoluciono hacia una versión más fuerte de mí mismo.",
        date: "2014-03-16",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Irradio positividad, atrayendo positividad. Soy un faro de luz, inspirando a los demás con mi optimismo.",
        date: "2014-03-17",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "El éxito me sigue sin esfuerzo. Confío en mi camino y abrazo la abundancia que se presenta en mi vida.",
        date: "2014-03-18",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Soy el autor de mi destino, escribiendo una historia de éxito, amor y gratitud. Atraigo abundancia con cada acción.",
        date: "2014-03-19",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Vivo en armonía con el universo, atrayendo positividad y éxito sin esfuerzo. Cada día es una oportunidad para crecer y celebrar.",
        date: "2014-03-20",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Cada día es un lienzo en blanco. Lo pinto con amor, gratitud y positividad. Soy el arquitecto de mi destino.",
        date: "2014-03-21",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "La gratitud llena mi corazón. Atraigo el éxito y la alegría con cada pensamiento positivo que tengo.",
        date: "2014-03-22",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Abrazo los desafíos como oportunidades de crecimiento. Cada obstáculo fortalece mi determinación y me impulsa hacia el éxito.",
        date: "2014-03-23",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Soy el maestro de mis pensamientos y acciones. Manifiesto la abundancia y el éxito sin esfuerzo en mi vida.",
        date: "2014-03-24",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Mi vida es un lienzo, y lo pinto con positividad y propósito. Atraigo éxito y realización sin esfuerzo.",
        date: "2014-03-25",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Cada obstáculo es una oportunidad para crecer. Soy resiliente, superando desafíos con gracia y determinación.",
        date: "2014-03-26",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Mi viaje está lleno de positividad y gratitud. Atraigo abundancia, éxito y alegría a mi vida sin esfuerzo.",
        date: "2014-03-27",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Irradio confianza y atraigo éxito. Cada día es un paso hacia la realización de mis sueños.",
        date: "2014-03-28",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Soy el arquitecto de mi destino, creando una vida llena de amor, propósito y abundancia. El éxito me sigue sin esfuerzo.",
        date: "2014-03-29",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Cada día es un regalo lleno de oportunidades ilimitadas. Acojo el éxito y la abundancia en mi vida.",
        date: "2014-03-30",
        language: "6502946f6a369b86e4f201f2",
        month: "March",
      },
      {
        content:
          "Soy capaz, merecedor y digno de alcanzar mis sueños. Atraigo positividad y éxito sin esfuerzo.",
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
