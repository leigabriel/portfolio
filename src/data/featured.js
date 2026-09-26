import { webProjects } from './web'
import { posterProjects } from './posters'
import { motionProjects } from './motion'

const SOURCES = { web: webProjects, poster: posterProjects, motion: motionProjects }
const TAGS = { web: 'WEB', poster: 'POSTER', motion: 'MOTION' }

const REFS = [
    { type: 'web', id: '02' },
    { type: 'web', id: '04' },
    { type: 'motion', id: '02', label: 'Motion Poster Rukia' },
]

export const featuredProjects = REFS.flatMap(({ type, id, label }) => {
    const project = SOURCES[type].find((item) => item.id === id)
    if (!project) return []

    return [
        {
            key: `${type}-${id}`,
            type,
            projectId: id,
            tag: TAGS[type],
            title: label || project.title,
            year: project.year,
            stack: project.stack || '',
            img: project.img,
            video: project.video,
            alt: `${label || project.title} ${type === 'motion' ? 'motion poster' : type === 'web' ? 'website preview' : 'poster design'}`,
            description: project.description.split('\n')[0].trim(),
            source: project,
        },
    ]
})
