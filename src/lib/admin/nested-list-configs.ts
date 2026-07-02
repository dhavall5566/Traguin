export type NestedRelationConfig = {
  endpoint: string;
  valueKey?: string;
  labelKey?: string;
  labelKeys?: string[];
};

export type NestedSubFieldType = "text" | "textarea" | "number" | "select" | "tags" | "relation";

export type NestedSubFieldDef = {
  name: string;
  label: string;
  type: NestedSubFieldType;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  relation?: NestedRelationConfig;
};

export type NestedListConfig = {
  itemLabel: string;
  fields: NestedSubFieldDef[];
  /** Compact multi-column cards for small repeated items (highlights, inclusions, etc.). */
  layout?: "stack" | "compact-grid";
};

export const NESTED_LIST_CONFIGS: Record<string, NestedListConfig> = {
  highlights: {
    itemLabel: "Highlight",
    layout: "compact-grid",
    fields: [
      { name: "text", label: "Text", type: "text", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  itineraryDays: {
    itemLabel: "Day",
    fields: [
      { name: "day_number", label: "Day number", type: "number", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "activities", label: "Activities", type: "tags", placeholder: "One activity per line" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  itineraryHotels: {
    itemLabel: "Hotel stay",
    fields: [
      {
        name: "hotel_id",
        label: "Linked hotel",
        type: "relation",
        relation: { endpoint: "/hotels", valueKey: "id", labelKey: "name" },
      },
      { name: "name", label: "Name", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "nights_label", label: "Nights label", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "stars", label: "Stars", type: "number" },
      { name: "category_label", label: "Category label", type: "text" },
      { name: "room_type", label: "Room type", type: "text" },
      { name: "meal_plan", label: "Meal plan", type: "text" },
      {
        name: "image_media_id",
        label: "Image media",
        type: "relation",
        relation: { endpoint: "/media", valueKey: "id", labelKeys: ["slug", "url"] },
      },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  inclusions: {
    itemLabel: "Inclusion",
    fields: [
      {
        name: "kind",
        label: "Kind",
        type: "select",
        required: true,
        options: [
          { value: "included", label: "Included" },
          { value: "excluded", label: "Excluded" },
        ],
      },
      { name: "text", label: "Text", type: "text", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  hotelAttractions: {
    itemLabel: "Attraction",
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "distance_label", label: "Distance", type: "text", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  experienceOffers: {
    itemLabel: "Offer",
    fields: [
      { name: "icon_key", label: "Icon key", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  experienceStats: {
    itemLabel: "Stat",
    fields: [
      { name: "value", label: "Value", type: "text", required: true },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  experienceProcessSteps: {
    itemLabel: "Process step",
    fields: [
      { name: "step_label", label: "Step label", type: "text", required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "detail", label: "Detail", type: "textarea", required: true },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  promoAssurances: {
    itemLabel: "Assurance",
    fields: [
      { name: "icon_key", label: "Icon key", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "label", label: "Label", type: "text", required: true },
    ],
  },
};

export type NestedListConfigId = keyof typeof NESTED_LIST_CONFIGS;
