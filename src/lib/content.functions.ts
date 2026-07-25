import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const { listServicesData } = await import("./content.server");
  return listServicesData();
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => String(slug))
  .handler(async ({ data: slug }) => {
    const { getServiceBySlugData } = await import("./content.server");
    return getServiceBySlugData(slug);
  });

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { listTestimonialsData } = await import("./content.server");
  return listTestimonialsData();
});

export const getBookingSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { getBookingSettingsData } = await import("./content.server");
  return getBookingSettingsData();
});

export const listFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const { listFaqsData } = await import("./content.server");
  return listFaqsData();
});

export const getPublicBookingStatus = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().min(1), token: z.string().min(10) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { getPublicBookingStatusData } = await import("./content.server");
    return getPublicBookingStatusData(data);
  });

