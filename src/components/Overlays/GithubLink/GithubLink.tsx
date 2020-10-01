import './GithubLink.scss'
import React = require('react')
import { Typography, Link } from '@material-ui/core'

export function GithubLink() {
    return <Typography className="GithubLinkParent">
        <Link href="https://github.com/JKU-ICG/projection-path-explorer">
            Github Page
        </Link>
    </Typography>
}