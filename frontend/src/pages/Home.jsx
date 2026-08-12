{/*import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const { user } = useAuth();
  const isStaff = ["agent", "authority", "admin"].includes(user?.role);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <section className="py-16 md:py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-light mb-4">
          Registre Civique · Services Publics
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-ink leading-[1.05] max-w-3xl mx-auto">
          Chaque plainte, un numéro. Chaque numéro, un suivi.
        </h1>
        <p className="text-slate text-base md:text-lg mt-6 max-w-xl mx-auto">
          Signalez un problème de service public en quelques minutes, suivez son avancement
          en temps réel, et consultez l'historique public des résolutions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {!isStaff && (
            <Link
              to={user ? "/nouvelle-plainte" : "/inscription"}
              className="bg-ink text-parchment px-5 py-3 rounded-sm font-medium hover:bg-ink-light focus-ring"
            >
              Déposer une plainte
            </Link>
          )}
          <Link
            to="/suivi"
            className="border border-ink/20 text-ink px-5 py-3 rounded-sm font-medium hover:bg-ink/5 focus-ring"
          >
            Suivre avec un numéro de ticket
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-5 pb-20">
        {[
          {
            step: "01",
            title: "Soumettre",
            text: "Décrivez le problème, ajoutez une localisation et des preuves photo ou vidéo.",
          },
          {
            step: "02",
            title: "Suivre",
            text: "Un numéro de ticket unique vous permet de suivre chaque étape du traitement.",
          },
          {
            step: "03",
            title: "Résoudre",
            text: "Le service concerné documente sa réponse et clôture la plainte de façon transparente.",
          },
        ].map((item) => (
          <div key={item.step} className="bg-white border border-ink/10 rounded-sm p-6">
            <span className="font-mono text-xs text-amber-dark">{item.step}</span>
            <h3 className="font-display text-xl text-ink mt-2 mb-1">{item.title}</h3>
            <p className="text-sm text-slate">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
*/}
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer.jsx";
import {
  FaWater,
  FaBolt,
  FaRoad,
  FaTrash,
  FaHospital,
  FaBus,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaClipboardCheck,
  FaArrowRight,
  FaMapMarkerAlt,
  FaBell,
  FaShieldAlt
} from "react-icons/fa";


const Home = () => {

  const { user } = useAuth();

  const isStaff = ["agent", "authority", "admin"].includes(user?.role);


  const services = [
    {
      icon: <FaWater />,
      title: "Eau",
      text: "Signalez les problèmes liés à la distribution d'eau."
    },
    {
      icon: <FaBolt />,
      title: "Électricité",
      text: "Déclarez les coupures ou anomalies électriques."
    },
    {
      icon: <FaRoad />,
      title: "Voirie",
      text: "Informez les autorités sur les problèmes routiers."
    },
    {
      icon: <FaTrash />,
      title: "Déchets",
      text: "Signalez les problèmes de collecte."
    },
    {
      icon: <FaHospital />,
      title: "Santé",
      text: "Améliorez les services sanitaires."
    },
    {
      icon: <FaBus />,
      title: "Transport",
      text: "Faites remonter les problèmes de mobilité."
    }
  ];


  const steps = [
    {
      number:"01",
      title:"Déposer une plainte",
      text:"Décrivez le problème, ajoutez une localisation et des preuves."
    },
    {
      number:"02",
      title:"Analyse",
      text:"Les autorités examinent votre demande."
    },
    {
      number:"03",
      title:"Traitement",
      text:"Le service concerné prend en charge la résolution."
    },
    {
      number:"04",
      title:"Résolution",
      text:"Vous recevez une notification de clôture."
    }
  ];


  const features = [
    {
      icon:<FaBell/>,
      title:"Notifications en temps réel",
      text:"Soyez informé de chaque changement de statut."
    },
    {
      icon:<FaShieldAlt/>,
      title:"Plateforme sécurisée",
      text:"Vos données sont protégées."
    },
    {
      icon:<FaMapMarkerAlt/>,
      title:"Géolocalisation",
      text:"Localisez précisément vos plaintes."
    },
    {
      icon:<FaClipboardCheck/>,
      title:"Transparence",
      text:"Consultez l'évolution des traitements."
    }
  ];



  return (

    <div className="bg-gray-50 text-gray-800">


      {/* HERO */}

      <section className="bg-gradient-to-br from-orange-700 to-orange-500 text-white">

        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">


          <div>

            <p className="uppercase tracking-widest text-blue-100 text-sm mb-4">
              Services Publics · Gouvernance
            </p>


            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Chaque plainte mérite
              <span className="block text-yellow-300">
                une réponse.
              </span>
            </h1>


            <p className="mt-6 text-lg text-blue-100 max-w-xl">

              Une plateforme citoyenne permettant de signaler,
              suivre et résoudre efficacement les problèmes
              rencontrés dans les services publics.

            </p>


            <div className="flex flex-wrap gap-4 mt-8">


              {!isStaff && (

                <Link
                  to={user ? "/nouvelle-plainte" : "/inscription"}
                  className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
                >
                  Déposer une plainte
                </Link>

              )}



              <Link
                to="/suivi"
                className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition"
              >
                Suivre une plainte
              </Link>


            </div>

          </div>



          <div className="flex justify-center">


            <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl">

              <FaClipboardCheck
                size={180}
                className="text-white"
              />

            </div>


          </div>


        </div>

      </section>




      {/* STATISTIQUES */}


      <section className="py-16">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-6">


          {[
            ["12000+","Plaintes reçues",<FaUsers/>],
            ["96%","Résolution",<FaCheckCircle/>],
            ["24h","Temps moyen",<FaClock/>],
            ["50+","Services publics",<FaClipboardCheck/>]

          ].map((item,index)=>(

            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 text-center hover:-translate-y-2 transition"
            >

              <div className="text-blue-600 text-3xl flex justify-center mb-3">
                {item[2]}
              </div>

              <h3 className="text-3xl font-bold">
                {item[0]}
              </h3>

              <p className="text-gray-500">
                {item[1]}
              </p>


            </div>

          ))}


        </div>


      </section>






      {/* SERVICES */}


      <section className="py-20">

        <div className="max-w-7xl mx-auto px-6">


          <h2 className="text-4xl font-bold text-center mb-12">
            Domaines concernés
          </h2>



          <div className="grid md:grid-cols-3 gap-6">


            {services.map((service,index)=>(


              <div
                key={index}
                className="bg-white rounded-2xl p-7 shadow hover:shadow-xl hover:-translate-y-2 transition"
              >


                <div className="text-blue-600 text-4xl mb-5">
                  {service.icon}
                </div>


                <h3 className="text-xl font-bold mb-2">
                  {service.title}
                </h3>


                <p className="text-gray-600">
                  {service.text}
                </p>


              </div>


            ))}


          </div>


        </div>

      </section>







      {/* COMMENT CA MARCHE */}



      <section className="bg-gray-100 py-20">


        <div className="max-w-7xl mx-auto px-6">


          <h2 className="text-4xl font-bold text-center mb-12">
            Comment ça fonctionne ?
          </h2>



          <div className="grid md:grid-cols-4 gap-6">


            {steps.map((step,index)=>(


              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow"
              >

                <span className="text-blue-600 text-xl font-bold">
                  {step.number}
                </span>


                <h3 className="font-bold text-xl mt-3">
                  {step.title}
                </h3>


                <p className="text-gray-600 mt-3">
                  {step.text}
                </p>


              </div>


            ))}


          </div>


        </div>


      </section>








      {/* FEATURES */}


      <section className="py-20">


        <div className="max-w-7xl mx-auto px-6">


          <h2 className="text-4xl font-bold text-center mb-12">
            Pourquoi utiliser notre plateforme ?
          </h2>



          <div className="grid md:grid-cols-4 gap-6">


            {features.map((item,index)=>(


              <div
                key={index}
                className="text-center"
              >

                <div className="text-blue-600 text-4xl flex justify-center mb-4">
                  {item.icon}
                </div>


                <h3 className="font-bold text-lg">
                  {item.title}
                </h3>


                <p className="text-gray-600 mt-2">
                  {item.text}
                </p>


              </div>


            ))}



          </div>


        </div>


      </section>







      {/* CTA */}


      <section className="bg-orange-700 text-white py-20 text-center px-6">


        <h2 className="text-4xl font-bold">
          Votre signalement peut améliorer un service.
        </h2>


        <p className="mt-5 text-blue-100 text-lg">
          Participez à une administration plus transparente.
        </p>


        <Link

          to={user ? "/nouvelle-plainte" : "/inscription"}

          className="inline-flex items-center gap-2 mt-8 bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:scale-105 transition"

        >

          Commencer maintenant

          <FaArrowRight/>

        </Link>


      </section>






      {/* FOOTER */}

      <Footer/>
     
    </div>

  );

};


export default Home;