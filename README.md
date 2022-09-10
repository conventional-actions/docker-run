# Docker Run

- Run a specific step in docker.
- Run an image built by a previous step.

## Usage

To use the GitHub Action, add the following to your job:

```yaml
- uses: conventional-actions/docker-run@v1
  with:
    image: myrepo/mydocker:latest
```

### Inputs

| Name         | Default                        | Description                  |
|--------------|--------------------------------|------------------------------|
| `image`      | required                       | Docker image                 |
| `options`    | N/A                            | Docker options               |
| `entrypoint` | N/A                            | Container entrypoint         |
| `command`    | N/A                            | Run command in the container |
| `shell`      | N/A                            | Use a specific shell         |
| `run`        | N/A                            | Run command in container     |
| `network`    | `${{ job.container.network }}` | Docker Network to use        |

### Outputs

No outputs

## Usage

### Typical use case

```yaml
- name: Checkout 
  uses: actions/checkout@v2 # Required to mount the Github Workspace to a volume 
- name: Login to GitHub Container Registry
  uses: docker/login-action@v2
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
- uses: conventional-actions/docker-run@v1
  with:
    image: private-image:latest
    options: -v ${{ github.workspace }}:/work -e ABC=123
    command: mycommand
```

### Run a privately-owned image

```yaml
- name: Login to GitHub Container Registry
  uses: docker/login-action@v2
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
- uses: conventional-actions/docker-run@v1
  with:
    image: test-image:latest
    run: echo "hello world"
```

#### Run an image built by a previous step
```yaml
- uses: docker/build-push-action@v2
  with:
    tags: test-image:latest
    push: false
- uses: conventional-actions/docker-run@v1
  with:
    image: test-image:latest
    run: echo "hello world"
```

#### Use a specific shell.

*Note: The shell must be installed in the container*

```yaml
- uses: conventional-actions/docker-run@v1
  with:
    image: docker:latest
    shell: /bin/bash
    run: |
      echo "first line"
      echo "second line"
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).

