import { MapPin, Phone, Truck } from 'lucide-react';

export function StoreInfo() {
  return (
    <section className="py-8 border-t border-gray-200 mt-8">
      <div className="bg-gray-50 rounded-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            New Guru Enterprises
          </h2>
          <p className="text-gray-600 mt-1">
            Wide Range of Home Appliances and Kitchenware
          </p>
        </div>

        {/* Home Delivery Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Truck className="h-5 w-5" />
            <span className="font-medium">Home Delivery Available</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Phone */}
          <a
            href="tel:9849067667"
            className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Call Us</p>
              <p className="font-medium text-gray-900">9849067667</p>
            </div>
          </a>

          {/* Address */}
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
            <div className="bg-primary/10 p-3 rounded-full shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Visit Us</p>
              <p className="text-sm font-medium text-gray-900">
                No. 5-4-726/1, Nampally Station Road, ABIDS SOUTH, Hyderabad, Telangana - 500001
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StoreInfo;
