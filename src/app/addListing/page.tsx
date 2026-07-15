"use client";

import {
  Button,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField, 
} from "@heroui/react";

export default function AddListingPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Form Submitted Successfully:", data);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm bg-white dark:bg-zinc-900/50 backdrop-blur-md">
        
        {/* Section Header */}
        <div className="mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create Listing
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Provide the baseline details to publish your property to the global network.
          </p>
        </div>

        <Form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          
          {/* Two-Column Grid Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            
            {/* Property Title */}
            <TextField name="title" className="w-full">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Property Title
              </Label>
              <Input placeholder="e.g. Luxury Beach Villa" />
            </TextField>

            {/* Location */}
            <TextField name="location" className="w-full">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Location
              </Label>
              <Input placeholder="e.g. Cox's Bazar, Bangladesh" />
            </TextField>

            {/* Price */}
            <TextField name="price" type="number" className="w-full">
              <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Price Per Night ($)
              </Label>
              <Input placeholder="12000$" />
            </TextField>

            {/* Combined Contextual Property Type Selector */}
            <div className="flex flex-col gap-1.5 w-full">
              <Select placeholder="Select Type" name="propertyType">
                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Property Type
                </Label>

                <Select.Trigger className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-transparent flex items-center justify-between text-left transition-colors focus:border-indigo-500">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>

                <Select.Popover className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl p-1">
                  <ListBox className="flex flex-col gap-0.5">
                    <ListBox.Item id="villa" textValue="Villa" className="px-3 py-1.5 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex justify-between items-center">
                      Villa
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="hotel" textValue="Hotel" className="px-3 py-1.5 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex justify-between items-center">
                      Hotel
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="apartment" textValue="Apartment" className="px-3 py-1.5 text-sm rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex justify-between items-center">
                      Apartment
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>

            {/* Image URL - Spans full width */}
            <div className="md:col-span-2">
              <TextField name="imageUrl" type="url" className="w-full">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Property Image URL
                </Label>
                <Input placeholder="https://example.com/villa.jpg" />
              </TextField>
            </div>

            {/* Description - Spans full width */}
            <div className="md:col-span-2">
              <TextField name="description" className="w-full">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Short Description
                </Label>
                <TextArea placeholder="Brief summary highlighting the unique qualities of your space..." />
              </TextField>
            </div>

          </div>

          {/* Form Actions Footnote */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button 
              type="submit" 
              className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm hover:shadow transition duration-200 rounded-lg"
            >
              Publish Listing
            </Button>
          </div>

        </Form>
      </div>
    </div>
  );
}