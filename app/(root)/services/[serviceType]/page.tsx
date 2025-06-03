import { serviceTypes } from "@/app/lib/serviceTypes";
import { getServiceProducts } from "@/app/actions/getServiceProducts";
import ServiceTemplate from "../../../../components/ServiceTemplate";

export async function generateStaticParams() {
  return serviceTypes.map((type) => ({
    serviceType: type.value,
  }));
}

export default async function ServicePage({
  params,
}: {
  params: { serviceType: string };
}) {
  const serviceType = serviceTypes.find(
    (type) => type.value === params.serviceType
  );

  if (!serviceType) {
    return <div>Service not found</div>;
  }

  const products = await getServiceProducts(params.serviceType);

  return (
    <ServiceTemplate
      serviceType={serviceType}
      products={products}
    />
  );
}