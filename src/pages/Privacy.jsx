import React, { useState } from 'react';
import { Shield, Mail, FileText, Lock, Users, Clock, Globe, AlertCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'intro', title: '1. Introduction', icon: FileText },
    { id: 'controller', title: '2. Data Controller', icon: Users },
    { id: 'collected', title: '3. Data Collected', icon: FileText },
    { id: 'purpose', title: '4. Purpose and Legal Basis', icon: Shield },
    { id: 'sharing', title: '5. Data Sharing', icon: Globe },
    { id: 'transfers', title: '6. International Transfers', icon: Globe },
    { id: 'retention', title: '7. Data Retention', icon: Clock },
    { id: 'security', title: '8. Data Security', icon: Lock },
    { id: 'rights', title: '9. User Rights (GDPR)', icon: Shield },
    { id: 'minors', title: '10. Minors', icon: Users },
    { id: 'cookies', title: '11. Cookies', icon: FileText },
    { id: 'modifications', title: '12. Policy Modifications', icon: AlertCircle },
    { id: 'contact', title: '13. Contact', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mezordo</h1>
              <p className="text-sm text-gray-600">Privacy Policy</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-3">Contents</h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{section.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="flex-1 bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-6">
                <strong>Last updated:</strong> October 7, 2025
              </p>
            </div>

            <section id="intro" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Mezordo is a dedicated healthcare application (Package ID: com.medoc.app) whose mission is to securely facilitate the management of medical prescriptions and improve patient–pharmacy interactions. This Privacy Policy explains how we collect, use, disclose, and protect your personal data, including highly sensitive health information. By using the Mezordo application, you consent to the data practices described in this policy.
              </p>
            </section>

            <section id="controller" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data Controller and Compliance Officer</h2>
              <p className="text-gray-700 mb-3">
                The data controller responsible for the processing of your personal data is:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-semibold text-gray-900">Mezordo</p>
                <p className="text-gray-700 mt-2">
                  <strong>Founder/Pharmacist:</strong> Nafeesa AZIZ (RPPS number: 10102321873)
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Email:</strong> <a href="mailto:admin@mezordo.com" className="text-indigo-600 hover:underline">admin@mezordo.com</a>
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Package ID:</strong> com.medoc.app
                </p>
                <p className="text-gray-700 mt-3">
                  Mobile application available on Google Play Store and Apple App Store.
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                We are a legitimate healthcare application operating in France in partnership with licensed pharmacies, fully committed to compliance with the GDPR (RGPD) and the French regulatory framework, including Hébergement de Données de Santé (HDS) requirements.
              </p>
            </section>

            <section id="collected" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Collected</h2>
              <p className="text-gray-700 mb-4">
                When you use the Mezordo application, we may collect the following types of data:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Required Personal Information</h3>
                  <p className="text-gray-700 mb-2">This data is essential for account creation, authentication, and secure service provision:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>First name and last name</li>
                    <li>Email address</li>
                    <li>Phone number (used for SMS OTP authentication)</li>
                    <li>Date of birth</li>
                    <li>Social security number (required for prescription processing by the pharmacy)</li>
                    <li>Health insurance information (e.g., insurer name, member ID)</li>
                    <li>Information from AME card (State Medical Aid), if applicable</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Optional Personal Information</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Home address (required only if you choose to use a delivery service)</li>
                    <li>Multi-profile data: Information of family members or authorized users added to your account (e.g., their name, date of birth, insurance details)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Health Data (Sensitive Personal Data)</h3>
                  <p className="text-gray-700 mb-2">As a health application, we collect and process the following sensitive personal data:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Medical prescriptions uploaded by the user (digital and photo formats)</li>
                    <li>Dispensing history linked to each prescription, as recorded by the selected pharmacy</li>
                    <li>Photos of Vitale, health insurance (Mutuelle), and AME cards uploaded by the user</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3.4 Technical and Usage Data</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>IP address and Login logs</li>
                    <li>Device identifier (e.g., advertising ID, hardware model, device type)</li>
                    <li>Application usage data (e.g., features used, frequency of use, crash reports)</li>
                    <li>Device information (model, operating system, language settings)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="purpose" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Purpose and Legal Basis for Data Processing</h2>
              <p className="text-gray-700 mb-4">
                We process your data for the following specific purposes, supported by a clear legal basis as required by GDPR:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">Purpose of Processing</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">Data Used</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">Legal Basis (GDPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Service Provision & Contract Execution (e.g., profile management, order tracking)</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">All data under 3.1, 3.2, 3.3</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Necessity for the performance of a contract (Terms of Service)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Secure Prescription Transmission</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">All data under 3.1, 3.3</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Explicit Consent of the user to process health data (Art. 9(2)(a))</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Account Security & Fraud Prevention</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Data under 3.1, 3.4</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Legitimate Interest in providing a secure and reliable service</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Regulatory & Health Compliance</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Data under 3.1, 3.3</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Compliance with a legal obligation (e.g., French Public Health Code)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">App Improvement & Analytics</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Data under 3.4</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Legitimate Interest in improving the user experience (aggregated/anonymized data)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="sharing" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We only share your data as described below and strictly for the purposes outlined in this policy.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Partner Pharmacies</h3>
                  <p className="text-gray-700">
                    Your Health Data (prescriptions, dispensing history) and Required Personal Information (including Social Security Number) are shared only with licensed pharmacies explicitly selected by you for the purpose of fulfilling your prescription order.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Technical Service Providers</h3>
                  <p className="text-gray-700 mb-2">
                    We use third-party service providers to support the operation and security of the application. These providers are bound by strict confidentiality agreements.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li><strong>HDS-certified hosting provider:</strong> For the secure storage of all health and personal data (see Section 8).</li>
                    <li><strong>Firebase/Google services:</strong> Used for application analytics, crash reporting, and security services.</li>
                    <li><strong>Geolocation services:</strong> Used to help you locate nearby pharmacies.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Competent Authorities</h3>
                  <p className="text-gray-700">
                    We may be required to disclose your data to competent administrative or judicial authorities in case of a legal obligation, judicial request, or to protect our legal rights.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                  <p className="text-gray-800 font-semibold">
                    We do not sell or rent your personal data to any third party.
                  </p>
                </div>
              </div>
            </section>

            <section id="transfers" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. International Data Transfers</h2>
              <p className="text-gray-700 mb-3">
                All Health Data (Section 3.3) and associated personal identifiers are stored within France (AWS Paris region) on HDS-certified infrastructure. This ensures maximum compliance with French and EU regulations.
              </p>
              <p className="text-gray-700 mb-3">
                Some Technical Data (Section 3.4), such as application analytics and crash reports managed by Firebase/Google, may be processed by service providers located outside the European Union (e.g., in the United States).
              </p>
              <p className="text-gray-700">
                These transfers are governed by robust safeguards, including the implementation of Standard Contractual Clauses (SCCs) approved by the European Commission, which ensure an adequate level of data protection equivalent to the GDPR.
              </p>
            </section>

            <section id="retention" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention Period</h2>
              <p className="text-gray-700 mb-4">
                We retain your data only for as long as necessary to fulfill the purposes for which it was collected or to comply with legal obligations.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">Data Category</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">Retention Period</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Account Information (3.1, 3.2)</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Until account deletion is requested</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">To provide continuous service</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Medical Prescriptions (3.3)</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Retained indefinitely in your account unless you request deletion</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">To allow users to consult their history for personal use</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Dispensing History (3.3)</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Retained according to pharmaceutical and health legal obligations</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Regulatory compliance</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Technical Data (3.4)</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">12 months</td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">Security purposes and application improvement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="security" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Security and HDS Certification</h2>
              <p className="text-gray-700 mb-4">
                We are committed to protecting your data through robust technical and organizational measures, meeting the requirements for handling sensitive health data.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.1 Security Commitments</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>All communications are encrypted via HTTPS/TLS protocol</li>
                    <li>Passwords are stored in hashed format, never in plain text</li>
                    <li>Two-factor authentication via SMS OTP is used for login</li>
                    <li>Encryption of sensitive data is implemented for data at rest</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">8.2 HDS Certification and Hosting</h3>
                  <p className="text-gray-700 mb-2">
                    Your Health Data is hosted on infrastructure located in France (AWS Paris region) which is HDS-certified (Hébergement de Données de Santé) by the French health authority. This guarantees a verified, secure, and compliant environment for hosting patient data.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Data access is strictly limited based on the least privilege principle and is continuously monitored and logged</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="rights" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Rights (GDPR)</h2>
              <p className="text-gray-700 mb-4">
                In accordance with the General Data Protection Regulation (GDPR), you have the following rights regarding your personal data:
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Right of Access:</strong>
                    <span className="text-gray-700"> Request a copy of the personal data we hold about you.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Right of Rectification:</strong>
                    <span className="text-gray-700"> Correct inaccurate or incomplete data.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Right to Erasure (Right to be Forgotten):</strong>
                    <span className="text-gray-700"> Request the deletion of your data under certain conditions.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Right to Data Portability:</strong>
                    <span className="text-gray-700"> Receive your data in a structured, commonly used, and machine-readable format.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Right to Object:</strong>
                    <span className="text-gray-700"> Object to data processing in certain cases (e.g., direct marketing).</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Right to Restriction of Processing:</strong>
                    <span className="text-gray-700"> Request processing limitation.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Deletion and Data Deletion</h3>
                <p className="text-gray-700 mb-3">
                  You can request the complete deletion of your account and all associated personal and health data by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-3">
                  <li>Using the account deletion feature within the Mezordo application settings</li>
                  <li>Sending a clear request via email to: <a href="mailto:admin@mezordo.com" className="text-indigo-600 hover:underline font-semibold">admin@mezordo.com</a></li>
                </ul>
                <p className="text-gray-700">
                  Upon receipt of a deletion request, we will delete your data within a reasonable timeframe, subject to our legal obligations to retain certain data for a specific period. We will confirm the deletion once complete.
                </p>
              </div>
            </section>

            <section id="minors" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Parental Control and Minors</h2>
              <div className="space-y-3 text-gray-700">
                <p>This application is not intended for users under 13 years old. We do not knowingly collect data from children under this age.</p>
                <p>For minors aged 13 to 18, parental or guardian consent is required to create an account and use the service.</p>
                <p>Parents or guardians can request access, modification, or deletion of their minor children's data.</p>
              </div>
            </section>

            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cookies and Similar Technologies</h2>
              <p className="text-gray-700 mb-3">
                The application may use tracking technologies (e.g., in-app local storage, Firebase Analytics) to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-3">
                <li>Maintain your login session (essential cookies)</li>
                <li>Analyze application usage and performance (analytics)</li>
              </ul>
              <p className="text-gray-700">
                You can manage or disable certain non-essential tracking technologies through your device settings or the application's internal settings, where available.
              </p>
            </section>

            <section id="modifications" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Policy Modifications</h2>
              <p className="text-gray-700">
                We reserve the right to modify this Privacy Policy to reflect changes in our practices or legal requirements. In case of substantial modification, you will be informed via a prominent notice within the application or by email. The "Last updated" date at the top of this document indicates when the policy was last revised.
              </p>
            </section>

            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact and Complaints</h2>
              <p className="text-gray-700 mb-4">
                For any questions regarding this Privacy Policy, your rights, or to submit a request:
              </p>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:admin@mezordo.com" className="text-indigo-600 hover:underline">admin@mezordo.com</a>
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Phone:</strong> <a href="tel:+33686194862" className="text-indigo-600 hover:underline">+33 6 86 19 48 62</a>
                </p>
              </div>
              <p className="text-gray-700 mb-3">
                You also have the right to file a complaint with the French Data Protection Authority (CNIL) if you believe your rights are not being respected:
              </p>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-semibold text-gray-900">CNIL</p>
                <p className="text-gray-700 mt-2">3 Place de Fontenoy - TSA 80715</p>
                <p className="text-gray-700">75334 PARIS CEDEX 07</p>
                <p className="text-gray-700 mt-2">
                  <strong>Phone:</strong> <a href="tel:0153732222" className="text-indigo-600 hover:underline">01 53 73 22 22</a>
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Website:</strong> <a href="http://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.cnil.fr</a>
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 Mezordo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}