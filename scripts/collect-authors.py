from pathlib import Path
from typing import Iterable

import frontmatter

DEBUG = False

ROOT_DIR = Path(__file__).resolve().parent.parent
PUB_DIRS = (
    ROOT_DIR / "content" / "publication",
    ROOT_DIR / "content" / "funding",
    ROOT_DIR / "content" / "post",
    ROOT_DIR / "content" / "event",
)
AUTHORS_DIR = ROOT_DIR / "content" / "authors"


def extract_authors(
    fpath: Path,
) -> set[str]:
    """
    Parse the frontmatter of a markdown file and extract authors from given file path

    Args:
        fpath: filepath

    Returns:
        set of authors
    """
    if not fpath.exists() or not fpath.is_file():
        raise FileNotFoundError(f"File not found: {fpath}")

    with fpath.open("r", encoding="utf-8") as fh:
        content = fh.read()
        fm = frontmatter.loads(content)

    return set(fm.get("authors", []))  # type: ignore[reportArgumentTypes]


def collect_known_authors() -> set[str]:
    # List all md files in the target directories
    md_files = [
        md_file
        for md_file in AUTHORS_DIR.glob("*/_index*md")
        if AUTHORS_DIR.exists() and AUTHORS_DIR.is_dir()
    ]
    if DEBUG:
        for i, md_file in enumerate(md_files):
            print(f" {i:3d}. {md_file}")

    infile_authors: set[str] = set().union(*(extract_authors(md) for md in md_files))
    dir_based_authors = set(md.parent.name for md in md_files)
    known_authors = infile_authors | dir_based_authors
    return known_authors


def main(target_dirs: Iterable[Path]):
    known_authors = collect_known_authors()
    print(f"Known authors: {len(known_authors)}")
    for i, author in enumerate(sorted(known_authors), 1):
        print(f"{i:3d}. {author}")

    # List all md files in the target directories
    md_files = [
        md_file
        for td in target_dirs
        for md_file in td.glob("**/*.md")
        if td.exists() and td.is_dir()
    ]
    print(f"Find total {len(md_files)} md files:")
    if DEBUG:
        for i, md_file in enumerate(md_files):
            print(f" {i:3d}. {md_file}")

    # Collect authors from frontmatter
    all_authors: set[str] = set().union(
        *(extract_authors(md_file) for md_file in md_files)
    )
    print(f"Found all {len(all_authors)} authors in frontmatter:")
    print(all_authors)

    print("-" * 10)

    # Check if all authors are known
    unknown_authors = all_authors - known_authors
    print(f"Found {len(unknown_authors)} unknown authors:")
    for i, author in enumerate(sorted(unknown_authors), 1):
        print(f"{i:3d}. {author}")


if __name__ == "__main__":
    print(ROOT_DIR)
    main(PUB_DIRS)
