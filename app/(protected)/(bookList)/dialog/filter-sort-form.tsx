import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FilterSort, filterSortSchema } from "@/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { MouseEventHandler } from "react";
import { useForm } from "react-hook-form";
import { AttributeSelector } from "./components/attribute-selector";

type FilterSortFormProps = {
  value: FilterSort;
  loadingState: boolean;
  onClose: () => void;
  onSaved: (filterSort: FilterSort) => void | Promise<void>;
};

export const FilterSortForm = ({
  value,
  loadingState: isLoading,
  onClose,
  onSaved,
}: FilterSortFormProps) => {
  const form = useForm<FilterSort>({
    resolver: zodResolver(filterSortSchema),
    defaultValues: value,
  });

  const filterInitial = value.filter;
  const sortByInitial = value.sort?.field;
  const orderByInitial = value.sort?.order;
  const isFilterSortActive =
    (filterInitial && filterInitial.length > 0) ||
    !(sortByInitial === "title" && orderByInitial === "asc");

  const onCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const onSubmit = async (data: FilterSort) => {
    const processedData: FilterSort = {
      ...data,
      filter: data.filter?.reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      }, [] as string[]),
    };
    await onSaved(processedData);
  };

  const onClearFilter = async () => {
    await onSaved({});
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Urutkan</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      onValueChange={(value) =>
                        field.onChange({
                          ...field.value,
                          field: value,
                        })
                      }
                      defaultValue={field.value?.field}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih satu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="title">Judul</SelectItem>
                        <SelectItem value="created_at">
                          Tanggal dibuat
                        </SelectItem>
                        <SelectItem value="updated_at">
                          Tanggal diubah
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(value) =>
                        field.onChange({ ...field.value, order: value })
                      }
                      defaultValue={field.value?.order}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih satu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="asc">A-Z</SelectItem>
                        <SelectItem value="desc">Z-A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>
              );
            }}
          />
          <Separator className="my-3" />
          <FormField
            control={form.control}
            name="filter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-center">
                  <p>Filter Atribut</p>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      field.onChange(field.value ? [...field.value, ""] : [""]);
                    }}
                    size="icon"
                    variant="ghost"
                  >
                    <i className="bx bx-plus" />
                  </Button>
                </FormLabel>
                <AttributeSelector field={field} />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-between">
          {isFilterSortActive && (
            <Button
              variant="link"
              size="sm"
              className="text-red-500 dark:text-red-400 group hover:no-underline"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClearFilter();
              }}
            >
              <i className="bx bx-trash me-2 text-base" />
              <span className="group-hover:underline">Hapus Filter</span>
            </Button>
          )}
          <div className="flex flex-1 justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={isLoading}>
              Terapkan
              {isLoading && <i className="bx bx-loader animate-loading" />}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
