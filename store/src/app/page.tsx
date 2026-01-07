import { Truck, Store, Phone } from 'lucide-react';

export default function Home() {
  return (
    <div className="container-main py-8">
      {/* Placeholder Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 md:p-12 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome to New Guru Enterprises
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Wide Range of home appliances and kitchenware
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
              <Truck className="h-4 w-4 text-success" />
              <span>Home Delivery Available</span>
            </div>
            <div className="flex items-center gap-2 bg-background rounded-full px-4 py-2 text-sm">
              <Store className="h-4 w-4 text-primary" />
              <span>Quality Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for Banner Carousel (Step 5) */}
      <section className="mb-8">
        <div className="bg-secondary/50 rounded-xl h-48 md:h-64 flex items-center justify-center border-2 border-dashed border-border">
          <p className="text-muted-foreground">Banner Carousel - Coming in Step 5</p>
        </div>
      </section>

      {/* Placeholder for Categories Grid (Step 5) */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="bg-secondary/50 rounded-xl h-32 flex items-center justify-center border-2 border-dashed border-border"
            >
              <p className="text-muted-foreground text-sm">Category {i}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Store Info Card */}
      <section className="bg-secondary/30 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Visit Our Store</h3>
            <p className="text-sm text-muted-foreground">
              No. 5-4-726/1, Nampally Station Road, ABIDS SOUTH, Hyderabad
            </p>
          </div>
          <a 
            href="tel:+919849067667"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-fit"
          >
            <Phone className="h-4 w-4" />
            <span>Call: 98490 67667</span>
          </a>
        </div>
      </section>
    </div>
  );
}
