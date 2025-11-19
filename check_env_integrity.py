from os import path

mandatory_keys = ["DISCORD_TOKEN", "OWNER_ID"]
actual_keys = []

def difference(a: list, b: list):
    """
    Return a list containing those values of 'a' that are not in 'b'.
    Set difference (a - b).
    """

    diff = []
    for item in a:
        if item not in b:
            diff.append(item)
    return diff

def check_env(path_env=".env"):
    # Verify file exists
    if not path.exists(path_env):
        raise FileNotFoundError(f"File {path_env} does not exist.")

    with open(path_env, "r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, start=1):
            line = line.strip()

            # Ignore empty lines or comments
            if not line or line.startswith("#"):
                continue
            else:
                # Verify that the line has KEY=VALUE format
                if "=" not in line:
                    raise ValueError(f"Invalid line in {path_env} (line {line_number}): '{line}'")

                # Separate key/value
                key, value = line.split("=", 1)

                key = key.strip()
                value = value.strip()

                actual_keys.append(key)

                if not key:
                    raise ValueError(f"Empty key found in line {line_number}")

                if value == "":
                    raise ValueError(f"'{key}' key does not have a value (line {line_number})")

                print(f"OK → {key} = {value}")

    missing_mandatory_keys = difference(mandatory_keys, actual_keys)

    if len(missing_mandatory_keys) > 0:
        key_list = ", ".join(missing_mandatory_keys)
        raise KeyError(f"These keys are not in the .env and they need to be settled: {key_list}")

    print("\n.env file validated with no errors.")


if __name__ == "__main__":
    check_env()
