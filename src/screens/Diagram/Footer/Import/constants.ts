import {SelectProps} from "@mantine/core";

export const ImportSelectOptions: SelectProps['data'] = [{
  value: "MySQL",
  label: "MySQL",
}, {
  value: "MariaDB",
  label: "MariaDB",
}, {
  value: "MongoDb",
  label: "MongoDb",
  disabled: true
}]
