var BUBBLE_PARAMETERS = {
    "data_file": "largest_cities.csv",
    "report_title": "Tabarka budget for 2016",
    "footer_text": "",
    "width": 940,
    "height": 700,
    "force_strength": 0.03,
    "force_type": "charge",
    "radius_field": "sum",
    "numeric_fields": ["sum","id"],
    "fill_color": {
        "data_field": "branch",
        "color_groups": {
            "المداخيل الجبائيّة الإعتياديّة": "#005288",
            "المداخيل غير الجبائية الاعتيادية": "#beccae",
            "الموارد الذاتية والمخصصة للتنمية": "#7aa25c",
            "موارد الاقتراض": "#d84b2a"
        }
    },
    "tooltip": [
        {"title": "Type", "data_field": "branch"},
        {"title": "Sub-type", "data_field": "sub_branch"},
        {"title": "Sub-sub-type", "data_field": "sub_sub_branch"},
        {"title": "Amount", "data_field": "sum", "format_string": ",.2r"}
    ],
    "modes": [
        {
            "button_text": "The Total",
            "button_id": "all",
            "type": "grid",
            "labels": null,
            "grid_dimensions": {"rows": 1, "columns": 1},
            "data_field": null
        },
       {
            "button_text": "Amount by Type",
            "button_id": "region",
            "type": "grid",
            "labels": ["المداخيل الجبائيّة الإعتياديّة", "المداخيل غير الجبائية الاعتيادية", "الموارد الذاتية والمخصصة للتنمية", "موارد الاقتراض"],
            "grid_dimensions": {"rows": 2, "columns": 2},
            "data_field": "branch"
        }
     /*   {
            "button_text": "Size of each amount",
            "button_id": "density_level",
            "type": "grid",
            "labels": ["low", "medium", "high"],
            "grid_dimensions": {"rows": 1, "columns": 3},
            "data_field": "sum"
        },
        {
            "button_text": "Area vs. Population",
            "button_id": "area_vs_population",
            "type": "scatterplot",
            "x_data_field": "branch",
            "y_data_field": "sum",
            "x_format_string": ",.2r",
            "y_format_string": ",.2r"
        }
        {
            "button_text": "World Map",
            "button_id": "world_map",
            "type": "map",
            "latitude_field": "Latitude",
            "longitude_field": "Longitude"
        }*/
    ]
};