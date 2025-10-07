export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-600 text-white rounded-full p-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mezordo</h1>
              <p className="text-gray-600">Application de pharmacie en France</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            Suppression de Compte
          </h2>
        </div>
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            Pour supprimer votre compte Mezordo et toutes les données associées, 
            veuillez suivre les étapes ci-dessous dans l'application mobile :
          </p>
        </div>
        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Comment Supprimer Votre Compte
          </h3>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 text-lg">
                  Ouvrez l'application <strong className="text-indigo-600">Mezordo</strong> sur votre appareil mobile
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 text-lg">
                  Connectez-vous à votre compte
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 text-lg">
                  Naviguez vers la section <strong className="text-indigo-600">"Compte"</strong> située dans la barre de navigation inférieure de l'application
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 text-lg">
                  Appuyez sur le bouton <strong className="text-red-600">"Supprimer le compte"</strong>
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 text-lg">
                  Confirmez votre décision de supprimer définitivement votre compte
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Warning Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-8">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="font-bold text-amber-900 text-lg mb-2">⚠️ Attention</h4>
              <p className="text-amber-800">
                Cette action est <strong>permanente et irréversible</strong>. Toutes vos données 
                seront définitivement supprimées de notre base de données.
              </p>
            </div>
          </div>
        </div>
        {/* Data Deletion Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Données Qui Seront Supprimées
          </h3>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-gray-800 mb-4">
              Lorsque vous supprimez votre compte, les informations suivantes seront 
              <strong className="text-red-700"> définitivement effacées</strong> de notre base de données :
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Toutes vos <strong>informations personnelles</strong> (nom, prénom, adresse, etc.)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Votre <strong>profil utilisateur</strong> et vos préférences</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>L'<strong>historique de vos commandes</strong> et transactions</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Vos <strong>identifiants de connexion</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Toutes les autres <strong>données associées</strong> à votre compte</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Retention Period */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Délai de Conservation
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Votre compte et toutes les données associées seront <strong>définitivement supprimés 
            dans un délai de 30 jours</strong> suivant votre demande de suppression. Certaines 
            informations peuvent être conservées pour des raisons légales, de sécurité ou 
            comptables, conformément à notre Politique de Confidentialité et à la législation 
            française en vigueur.
          </p>
        </div>
        {/* Support Section */}
        <div className="bg-indigo-600 text-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Besoin d'Aide ?
          </h3>
          <p className="mb-4">
            Si vous rencontrez des difficultés pour supprimer votre compte ou si vous avez 
            des questions, n'hésitez pas à contacter notre équipe d'assistance :
          </p>
          <div className="bg-indigo-700 rounded-lg p-4 space-y-2">
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <strong>Email :</strong> admin@mezordo.com
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <strong>Délai de réponse :</strong> Sous 48 heures
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-12 text-center text-gray-600 border-t border-gray-200 pt-8">
          <p className="text-lg font-semibold text-gray-800 mb-1">Mezordo</p>
          <p className="text-sm">Application de pharmacie pour la région France</p>
          <p className="text-sm mt-2">Dernière mise à jour : Octobre 2025</p>
        </div>
      </div>
    </div>
  );
}









