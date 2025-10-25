"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/public/HeroSection";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="Terms and Conditions"
        subtitle="Please read our terms and conditions carefully before using our services"
      />

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Declaration of Goods */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Declaration of Goods
              </h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Clients are required to be honest and transparent in declaring
                  the content of their packages before delivery at our
                  warehouse.
                </p>

                <p>
                  Machines, medical devices, fragile items, liquids, chemicDandeal,
                  gases, powders, cosmetics, battery goods (lithium batteries),
                  corrosives, flammables, explosives, toxic substances, living
                  organisms, radioactive materiDandeal, etc. are termed as:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Sensitive Goods</li>
                  <li>Hazardous Goods</li>
                  <li>Dangerous Goods</li>
                  <li>Special Goods</li>
                </ul>

                <p>
                  Items listed above, as well as fragile goods, must be properly
                  packaged and labelled according to acceptable UN standards for
                  international shipping by AIR or SEA.
                </p>

                <p>
                  Dandeal Logistics and Importation may decline to ship any of these hazardous
                  materiDandeal or goods with inherent vice or goods that may pose
                  risk to other packages if guidelines concerning packaging and
                  labelling are not adhered to by the client.
                </p>

                <p>
                  Each package must be accompanied by a warehouse declaration
                  form fully filled by the supplier to confirm:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>All necessary information about the goods</li>
                  <li>Full name of client</li>
                </ul>
                <p>
                  before the package(s) can be accepted at the warehouse for
                  carriage by both AIR and SEA.
                </p>

                <p>This information may be vital for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Invoice creation before goods are loaded</li>
                  <li>Insurance purposes</li>
                  <li>Customs declaration purposes</li>
                </ul>

                <p>
                  Thus, clients are encouraged to provide Dandeal Logistics and Importation
                  the true value of their goods every time.
                </p>

                <p>
                  Dandeal Logistics and Importation will not be liable nor accountable for any
                  goods sent to our warehouse with fDandeale declaration which will
                  result in confiscation by customs, either at port of loading
                  (POL) or port of delivery (POD).
                </p>

                <p>
                  Each package must have the appropriate shipping mark pasted on
                  each package for easy identification and delivery. Kindly take
                  note that Dandeal Logistics and Importation will not be held liable for
                  consequences that may result from failure to comply.
                </p>

                <p>
                  In case of any applied custom penalty or consequential losses
                  or damages occurring due to failure to declare dangerous
                  goods, the clients shall be held responsible and may have to
                  pay for all damages, losses or penalties incurred.
                </p>

                <p>
                  Clients must be aware that goods considered as dangerous may
                  be shipped if declared and documented appropriately.
                </p>

                <p>
                  Dandeal Logistics and Importation shall not be held liable for any penalty
                  or seizure of goods if the client fails to declare as
                  requested above.
                </p>
              </div>
            </div>

            <hr className="my-8" />

            {/* Damages, Losses and Compensation */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Damages, Losses and Compensation
              </h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Dandeal Logistics and Importation shall not be responsible for any damages
                  or losses that occur before receipt of goods or delivery at
                  our warehouse for shipping. Our responsibility begins when
                  goods are accepted and confirmed to the client.
                </p>

                <p>
                  Dandeal Logistics and Importation will not be liable for any damages/losses
                  that occur to goods due to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Inherent vices (ability of the goods to decompose by itself,
                    rust or break)
                  </li>
                  <li>
                    Improper packaging and labelling of goods during shipping
                    and delivery of goods to clients in Ghana
                  </li>
                </ul>

                <p>
                  Dandeal Logistics and Importation may only take responsibility and
                  compensate clients if the procurement was done or supervised
                  on behalf of the client.
                </p>

                <p>
                  Dandeal Logistics and Importation may compensate client(s) only for losses
                  that occur after goods are confirmed and received in good
                  condition but had issues before delivery at the supposed
                  delivery point in Ghana.
                </p>

                <p>
                  In situations where goods are procured on behalf of client(s)
                  through online platforms, Dandeal Logistics and Importation shall not be
                  held liable for goods that do not meet client's expectations
                  or standards after agreeable confirmation and negotiations by
                  the client(s).
                </p>

                <p>
                  Dandeal Logistics and Importation shall implement compensations according to
                  our own discretion for refund on items that are procured on
                  behalf of a client after initial acceptance by both parties.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Dandeal Logistics and Importation will ensure that audio–visuDandeal and
                    necessary information on the items will be presented to
                    client(s) for confirmation before procurement will be
                    effected.
                  </li>
                </ul>

                <p>Dandeal Logistics and Importation will refund:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>50% of the shipping cost</li>
                  <li>30% of the product cost</li>
                </ul>
                <p>
                  as compensation on damaged goods if proven that all
                  precautionary measures were duly adhered to by the client or
                  supplier and lost goods.
                </p>

                <p>
                  Owners of damaged goods must provide the following before
                  compensation:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Evidence of payment of shipping fees.</li>
                  <li>
                    Invoice of the goods and supplier's contact information.
                  </li>
                </ul>

                <p>
                  Goods are declared missing or lost after 90 days of the ETA
                  communicated for that shipment if it is established that the
                  whereabouts of the goods is unknown.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Compensation for missing or lost goods comes in a form of
                    credit note which will be used for future shipments.
                  </li>
                  <li>
                    20% of the shipping cost of each future shipment will be
                    taken off to defray the agreed cost of the missing item as
                    stated on the invoice from supplier and shipping cost paid
                    to Dandeal Logistics and Importation and Logistics Ltd. until the total
                    amount is cleared.
                  </li>
                </ul>

                <p>
                  Owners of lost goods must provide the following before
                  compensation:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Payment receipt of shipping fees.</li>
                  <li>
                    Invoice of the goods and supplier's contact information.
                  </li>
                </ul>

                <p>
                  Clients must ensure that fragile goods are packaged & marked
                  appropriately before delivery at our warehouse.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Dandeal Logistics and Importation will not accept any liability for
                    damages if goods are not properly marked with appropriate
                    handling instructions/symbols.
                  </li>
                </ul>

                <p>
                  Dandeal Logistics and Importation will not be held accountable for the loss
                  of items and related complaints after receipt or delivery of
                  goods to clients after 24 hours.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Fragile goods should immediately be checked upon delivery
                    and receipt.
                  </li>
                  <li>
                    Dandeal Logistics and Importation shall not be liable for damages after
                    clients accept responsibility for such fragile goods.
                  </li>
                </ul>

                <p>
                  All clients must endeavour to fill the delivery note upon
                  receipt of any goods or packages and report any form of
                  inconsistencies immediately in the remarks column.
                </p>

                <p>
                  Clients must ensure proper identification of their goods
                  (AIR/SEA) and must communicate immediately to Customer Care
                  Representative in case of any mistakes or change of mind.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Dandeal shall not be liable for any losses or delay in delivery
                    that occur due to improper identification of goods, and
                    delivery to wrong warehouse address.
                  </li>
                </ul>

                <p>
                  Clients must always confirm the right warehouse address and
                  ensure that suppliers mark their goods with the exact shipping
                  mark given by Dandeal Customer Care Representative for smooth
                  operation for all new orders.
                </p>
              </div>
            </div>

            <hr className="my-8" />

            {/* Loading Date */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Loading Date
              </h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Loading date of containers from our warehouse is different
                  from the Sailing (Loaded on Board) date.
                </p>
                <p>
                  Goods are received at the warehouse several days before
                  loading into a container and transported to the shipping yard
                  to await arrival of the ship.
                </p>
                <p>Vessel takes off 7–10 days after loading date.</p>
              </div>
            </div>

            <hr className="my-8" />

            {/* Delays or Changes in Arrival Dates */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Delays or Changes in Arrival Dates of Shipment
              </h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Dandeal Logistics and Importation only communicates Estimated Time of
                  Arrival (ETA) as given by the Shipping Line/Airline which is
                  for informational purposes and is subject to change.
                </p>
                <p>
                  We will not be held liable for consequential losses that occur
                  due to delay in arrival of goods to Ghana (delay from Shipping
                  Line/Airline) which is beyond our control.
                </p>
                <p>
                  Transit time or ETA obtained from a shipping or airline is
                  provisional and given for informational purposes only, without
                  warranty of any kind either expressed or implied, and is
                  subject to change at any time without prior notice from the
                  shipping or airline.
                </p>
                <p>
                  Container clearance takes 5–10 working days upon arrival at
                  Tema Port.
                </p>
                <p>
                  Clients will be notified by Dandeal staff for pick-up or delivery
                  after 24 hours of offloading.
                </p>
                <p>
                  We will always ensure that goods are cleared within a maximum
                  of 10 working days from date of discharge of containers at
                  port except in circumstances beyond our control which shall be
                  duly communicated to clients by our staff.
                </p>
              </div>
            </div>

            <hr className="my-8" />

            {/* Charges */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Charges</h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Air cargo is charged based on type of commodity and gross
                  weight except for lightweight goods, volumetric weight is
                  applied, whichever is higher.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Minimum chargeable weight is 5kg (China) and 10kg (Dubai and
                    Turkey) for normal goods
                  </li>
                  <li>
                    10kg minimum for special goods i.e. Dangerous, Sensitive,
                    Special or Hazardous Goods
                  </li>
                </ul>

                <p>
                  Sea cargo is charged based on CBM on any type of commodity.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Minimum chargeable CBM required is 0.1 CBM (China), 1 CBM
                    (Dubai) and 0.5 CBM (Turkey) for normal goods
                  </li>
                  <li>
                    Below 1 CBM to Accra is charged on usd300 and usd400 to
                    Kumasi
                  </li>
                </ul>

                <p>Charges for Air and Sea cover:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Cost of freight</li>
                  <li>Duty</li>
                  <li>Clearance only (without delivery)</li>
                </ul>

                <p>
                  All charges, especially for Air Cargo, must be prepaid prior
                  to shipping.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    For Sea Cargo, a minimum of 70% must be paid prior to
                    loading into the container and the rest paid before
                    delivery.
                  </li>
                  <li>
                    For Air Cargo, full payment of shipping cost is required
                    before shipment.
                  </li>
                </ul>

                <p>
                  All shipping charges must be paid before arrival of goods in
                  Ghana or before delivery, as and when invoices are dispatched.
                </p>

                <p>
                  Charges are quoted in USD but payable in GHC at a
                  predetermined rate different from interbank rates due to
                  charges on transfers and SWIFT charges to shipping countries.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    Clients can Dandealo pay in USD but SWIFT or transfer charges
                    must be added.
                  </li>
                </ul>

                <p>
                  Dandeal Logistics and Importation has the right to make and communicate
                  changes in shipping rate at any time due to unannounced
                  fluctuations in freight cost, duty and clearance charges by
                  the stakeholders involved.
                </p>

                <p>
                  Dandeal Logistics and Importation and Logistics may provide seasonal
                  promotional offers as part of its commitment to building
                  strong relationships with clients and providing exceptional
                  services.
                </p>

                <p>
                  We kindly plead to our cherished clients to facilitate prompt
                  payments to ensure swift delivery.
                </p>

                <p>
                  Storage and security cost of undelivered goods beyond one week
                  will be transferred to the client.
                </p>

                <p>
                  After one month of storage, goods will be deemed to have no
                  owners.
                </p>

                <p>
                  We shall seek court order to auction these items after several
                  notifications to make way for the storage of new cargo.
                </p>

                <p>
                  Clients who have paid fully for their goods but yet use Dandeal
                  facility as storage will be made to pay a minimum of GHS100
                  per CBM every week.
                </p>
              </div>
            </div>

            <hr className="my-8" />

            {/* Delivery */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Delivery
              </h2>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Delivery cost must be borne by the client. Free delivery
                  services will be applied using our own discretion or for
                  promotional purposes only.
                </p>
                <p>
                  Failure to pick up goods within the stipulated time of 1 week
                  will attract a penalty of GHS100 weekly.
                </p>
                <p>
                  Clients should note that goods not picked up after one month
                  will be set for auction and sold.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
