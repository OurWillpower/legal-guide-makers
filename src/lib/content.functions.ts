import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getBookingSettingsData,
  getPublicBookingStatusData,
  getServiceBySlugData,
  listFaqsData,
  listServicesData,
  listTestimonialsData,
} from "./content.server";

export const listServices = createServerFn({ method: "GET" }).handler(() => listServicesData());

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => String(slug))
  .handler(({ data: slug }) => getServiceBySlugData(slug));

export const listTestimonials = createServerFn({ method: "GET" }).handler(() => listTestimonialsData());

export const getBookingSettings = createServerFn({ method: "GET" }).handler(() => getBookingSettingsData());

export const listFaqs = createServerFn({ method: "GET" }).handler(() => listFaqsData());

export const getPublicBookingStatus = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().min(1), token: z.string().min(10) }).parse(raw),
  )
  .handler(({ data }) => getPublicBookingStatusData(data));

