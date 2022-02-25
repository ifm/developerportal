# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'O3R'
copyright = '2021, ifm CSR'
author = 'ifm CSR'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'myst_parser',
    'sphinx_automodapi.automodapi',
    'sphinx.ext.autosectionlabel',
    'sphinx_tabs.tabs', 
    'sphinx.ext.imgconverter', # Used for svg images in pdf generation
    'sphinx_last_updated_by_git', # Add the "Last updated note in the footer (taken from git latest commit on file)"
    'sphinx_copybutton', # Ability to copy-paste code

   ]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = [
    '_build', 
    'Thumbs.db', 
    '.DS_Store',
    'etc']

master_doc = 'index'

# -- Configuring the extensions -------------------------------------------------

# Make sure the  auto generated target is unique
autosectionlabel_prefix_document = True

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    'canonical_url': '',
    'analytics_id': '',
    'display_version': True,
    'prev_next_buttons_location': 'bottom',
    'style_external_links': False,

    'logo_only': False,

    # Toc options
    'collapse_navigation': True,
    'sticky_navigation': True,
    'navigation_depth': -1,
    'includehidden': True,
    'titles_only': False
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']
html_css_files = [
    'custom.css',
]

myst_enable_extensions = [
    "colon_fence",
    "substitution", # This enable the definition of substitution variables (see below)
]

# -------------------------------------------------
# -- Options for pdf output
# -------------------------------------------------
latex_engine = 'lualatex'
latex_elements = {
    'fontpkg': r'''
\setmainfont{DejaVu Serif}
\setsansfont{DejaVu Sans}
\setmonofont{DejaVu Sans Mono}
''',
}

# -------------------------------------------------
# -- Substitution variables
# -------------------------------------------------
myst_substitutions = {
    "ifm3d_gh_url" : "https://github.com/ifm/ifm3d",
    "ifm3d_main_branch":  "o3r/main-next", # The most up to date branch on ifm3d
    "ifm3d_latest_tag_url": "https://github.com/ifm/ifm3d/tags",
}