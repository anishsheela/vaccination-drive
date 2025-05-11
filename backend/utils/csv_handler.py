import csv
import io
import pandas as pd


class CSVHandler:
    @staticmethod
    def validate_csv_structure(file, required_columns):
        """Validate CSV file structure"""
        try:
            # Read the first line to check headers
            file.seek(0)
            reader = csv.reader(file)
            headers = next(reader)

            # Convert headers to lowercase for case-insensitive comparison
            headers = [h.lower().strip() for h in headers]
            required_columns = [col.lower() for col in required_columns]

            # Check if all required columns are present
            missing_columns = [col for col in required_columns if col not in headers]
            if missing_columns:
                return False, f"Missing required columns: {', '.join(missing_columns)}"

            return True, headers
        except Exception as e:
            return False, f"Error reading CSV file: {str(e)}"

    @staticmethod
    def generate_csv_template(columns):
        """Generate a CSV template with specified columns"""
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(columns)
        output.seek(0)
        return output

    @staticmethod
    def export_data_to_csv(data, columns):
        """Export data to CSV format"""
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=columns)
        writer.writeheader()
        writer.writerows(data)
        output.seek(0)
        return output