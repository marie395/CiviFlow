import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";


const Footer = () => {

  return (

    <footer className="bg-gray-900 text-gray-300">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">


        {/* Logo */}

        <div>

          <div className="flex items-center gap-3 mb-4">

            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
             CF
            </div>

            <h2 className="text-white text-xl font-bold">
              CiviFlow
            </h2>

          </div>


          <p className="text-sm leading-6">

            Une plateforme numérique permettant aux citoyens
            de signaler, suivre et résoudre les problèmes
            liés aux services publics.

          </p>


        </div>





        {/* Liens rapides */}


        <div>


          <h3 className="text-white font-bold text-lg mb-5">
            Liens rapides
          </h3>


          <ul className="space-y-3 text-sm">


            <li className="hover:text-blue-400 cursor-pointer">
              Accueil
            </li>

            <li className="hover:text-blue-400 cursor-pointer">
              Déposer une plainte
            </li>

            <li className="hover:text-blue-400 cursor-pointer">
              Suivre une plainte
            </li>

            <li className="hover:text-blue-400 cursor-pointer">
              Tableau public
            </li>


          </ul>


        </div>





        {/* Services */}


        <div>


          <h3 className="text-white font-bold text-lg mb-5">
            Services
          </h3>


          <ul className="space-y-3 text-sm">


            <li>
              Eau
            </li>

            <li>
              Électricité
            </li>

            <li>
              Voirie
            </li>

            <li>
              Santé
            </li>


          </ul>


        </div>






        {/* Contact */}


        <div>


          <h3 className="text-white font-bold text-lg mb-5">
            Contact
          </h3>


          <ul className="space-y-4 text-sm">


            <li className="flex gap-3 items-center">

              <FaMapMarkerAlt className="text-blue-500"/>

              Administration publique

            </li>



            <li className="flex gap-3 items-center">

              <FaPhone className="text-blue-500"/>

              +237 683499257

            </li>



            <li className="flex gap-3 items-center">

              <FaEnvelope className="text-blue-500"/>

              contact@CiviFlow.com

            </li>


          </ul>



        </div>



      </div>





      {/* Bottom */}


      <div className="border-t border-gray-700">


        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">


          <p className="text-sm">

            © 2026 CiviFlow. Tous droits réservés.

          </p>




          <div className="flex gap-5 text-xl">


            <FaFacebook className="hover:text-blue-500 cursor-pointer"/>

            <FaTwitter className="hover:text-blue-400 cursor-pointer"/>

            <FaLinkedin className="hover:text-blue-600 cursor-pointer"/>


          </div>


        </div>


      </div>



    </footer>

  );

};


export default Footer;